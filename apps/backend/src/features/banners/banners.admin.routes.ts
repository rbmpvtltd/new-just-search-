import { db, schemas } from "@repo/db";
import { logger } from "@repo/helper";
import { and, eq, ilike, inArray, or, sql } from "drizzle-orm";
import z from "zod";
import { publicProcedure, router } from "@/utils/trpc";

const banners = schemas.not_related.banners;

const inputSchema = z.object({
  pagination: z.object({
    pageIndex: z.number(),
    pageSize: z.number(),
  }),
  sorting: z.array(
    z.object({
      desc: z.boolean(),
      id: z.string(),
    }),
  ),
  filters: z.array(
    z.object({
      id: z.string(),
      value: z.unknown(),
    }),
  ),
  globalFilter: z.string().optional(), // optional to allow empty
});

type InputType = z.infer<typeof inputSchema>;

// Helper: map filter ID to actual Drizzle column
const getColumnFromId = (id: string) => {
  const columnMap = {
    id: banners.id,
    route: banners.route,
    photo: banners.photo,
    isActive: banners.isActive,
    type: banners.type,
  };

  return columnMap[id as keyof typeof columnMap] ?? null;
};

// Helper: build condition for a single filter
//
const buildFilterCondition = (filter: { id: string; value: unknown }) => {
  const { id, value } = filter;

  // Skip empty, null, or empty arrays
  if (
    value == null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return null;
  }

  const column = getColumnFromId(id);
  if (!column) {
    logger.warn(`No column found for filter id: ${id}`);
    return null;
  }

  // Handle array values (multi-select)
  if (Array.isArray(value)) {
    if (value.length === 0) return null;

    // Special handling per column type
    if (id === "is_active") {
      // Convert string booleans to actual booleans
      const boolValues = value.map((v) =>
        typeof v === "string" ? v.toLowerCase() === "true" : Boolean(v),
      );
      return inArray(column, boolValues);
    }

    if (id === "type" || id === "id") {
      // Convert to numbers if possible
      const numValues = value.map((v) => {
        if (typeof v === "string") {
          const num = Number(v);
          return Number.isNaN(num) ? v : num; // fallback to string if not a number
        }
        return v;
      });
      return inArray(column, numValues);
    }

    // Default: treat as strings (for text columns like route, photo)
    const stringValues = value.map((v) => String(v));
    return inArray(column, stringValues);
  }

  // Handle single values (non-array)
  if (typeof value === "string") {
    if (id === "is_active") {
      const boolValue = value.toLowerCase() === "true";
      return eq(column, boolValue);
    }
    if (id === "type" || id === "id") {
      const numValue = Number(value);
      if (!Number.isNaN(numValue)) {
        return eq(column, numValue);
      }
    }
    return ilike(column, `%${value}%`);
  }

  if (typeof value === "boolean" && id === "is_active") {
    return eq(column, value);
  }

  if (typeof value === "number") {
    return eq(column, value);
  }

  return null;
};

export const adminBannerRouter = router({
  thirdBanner: publicProcedure
    .input(inputSchema)
    .query(async ({ input }: { input: InputType }) => {
      const pageIndex = input.pagination.pageIndex;
      const pageSize = input.pagination.pageSize;
      const offset = pageIndex * pageSize;

      // --- Build WHERE conditions ---
      const whereConditions = [];

      // 1. Global filter (if provided)
      if (input.globalFilter) {
        whereConditions.push(
          or(
            ilike(banners.photo, `%${input.globalFilter}%`),
            ilike(banners.route, `%${input.globalFilter}%`),
          ),
        );
      }

      // 2. Column-specific filters
      // NOTE: needed to understand
      const columnFilterConditions = input.filters
        .map(buildFilterCondition)
        .filter((cond): cond is NonNullable<typeof cond> => cond !== null);

      whereConditions.push(...columnFilterConditions);

      // Combine all with `and`; if none, leave as undefined
      const finalWhere =
        whereConditions.length > 0 ? and(...whereConditions) : undefined;

      // --- Build ORDER BY ---
      const allowedColumns = ["id", "route", "photo", "is_active", "type"];
      let orderByClause = sql`id DESC`;

      if (input.sorting.length > 0) {
        const orderExpressions = input.sorting
          .filter((sort) => allowedColumns.includes(sort.id))
          .map((sort) => {
            const column = sql.identifier(sort.id);
            return sort.desc ? sql`${column} DESC` : sql`${column} ASC`;
          });

        if (orderExpressions.length > 0) {
          orderByClause = sql`${sql.join(orderExpressions, sql`, `)}`;
        }
      }

      // --- Execute query ---
      const data = await db
        .select()
        .from(banners)
        .where(finalWhere)
        .orderBy(orderByClause)
        .limit(pageSize)
        .offset(offset);

      // --- Count total (for pagination) ---
      const totalResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(banners)
        .where(finalWhere);

      const total = Number(totalResult[0]?.count ?? 0);
      const totalPages = Math.ceil(total / pageSize);

      return {
        pageCount: totalPages, // ! you had pageIndex here — likely a bug!
        data,
        totalCount: total,
        totalPages,
      };
    }),
});
