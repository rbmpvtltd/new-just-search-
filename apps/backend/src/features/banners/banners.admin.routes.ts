import { db, schemas } from "@repo/db";
import { logger } from "@repo/helper";
import { and, ilike, or, sql } from "drizzle-orm";
import z from "zod";
import { publicProcedure, router } from "@/utils/trpc";

const banners = schemas.not_related.banners;

// Define input and output schemas
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
  globalFilter: z.string(),
});

type InputType = z.infer<typeof inputSchema>;

export const adminBannerRouter = router({
  // TODO: use adminProcedure;
  thirdBanner: publicProcedure
    .input(inputSchema)
    .query(async ({ input }: { input: InputType }) => {
      const pageIndex = input.pagination.pageIndex;
      const pageSize = input.pagination.pageSize;
      const offset = pageIndex * pageSize;

      input.filters.map((item) => {
        item.id;
        item.value;
      });

      const allowedColumns = ["id", "route", "photo", "is_active", "type"];
      let orderByClause = sql`id DESC`;
      if (input.sorting.length > 0) {
        const orderExpressions = input.sorting
          .filter((sort) => allowedColumns.includes(sort.id))
          .map((sort) => {
            const column = sql.identifier(sort.id);
            return sort.desc ? sql`${column} DESC` : sql`${column} ASC`;
          });

        logger.info(orderExpressions);

        if (orderExpressions.length > 0) {
          orderByClause = sql`${sql.join(orderExpressions, sql`, `)}`;
        }
      }

      console.log({
        // orderByClause,
        pageSize,
        offset,
        global: input.globalFilter,
      });

      const data = await db
        .select()
        .from(banners)
        .where(
          and(
            or(
              ilike(banners.photo, `%${input.globalFilter}%`),
              ilike(banners.route, `%${input.globalFilter}%`),
            ),
          ),
        )
        .orderBy(orderByClause)
        .limit(pageSize)
        .offset(offset);

      const totalResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(banners)
        .where(
          or(
            ilike(banners.photo, `%${input.globalFilter}%`),
            ilike(banners.route, `%${input.globalFilter}%`),
          ),
        );
      // .where(eq(banners.type, 3)); // TODO: undo this after testing

      const total = Number(totalResult[0]?.count ?? 0);
      const totalPages = Math.ceil(total / pageSize);
      logger.info({ total, totalPages });

      const result = {
        pageCount: input.pagination.pageIndex,
        data,
        totalCount: total,
        totalPages,
      };

      return result;
    }),
});
