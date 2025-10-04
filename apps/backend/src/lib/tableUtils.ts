// lib/tableUtils.ts

import { db } from "@repo/db";
import { and, eq, ilike, inArray, or, type SQL, sql } from "drizzle-orm";
import type { AnyPgColumn, PgTable } from "drizzle-orm/pg-core";
import z from "zod";

// Reusable input schema
export const tableInputSchema = z.object({
  pagination: z.object({
    pageIndex: z.number().int().min(0),
    pageSize: z.number().int().min(1).max(100),
  }),
  sorting: z.array(
    z.object({
      id: z.string(),
      desc: z.boolean(),
    }),
  ),
  filters: z.array(
    z.object({
      id: z.string(),
      value: z.unknown(),
    }),
  ),
  globalFilter: z.string().optional(),
});

export type TableInput = z.infer<typeof tableInputSchema>;

// Generic column map type
export type ColumnMap<T extends Record<string, AnyPgColumn>> = {
  [K in keyof T]: T[K];
};

// Build WHERE clause
export function buildWhereClause<T extends Record<string, AnyPgColumn>>(
  filters: { id: string; value: unknown }[],
  globalFilter: string | undefined,
  columnMap: ColumnMap<T>,
  globalFilterColumns?: AnyPgColumn[],
): SQL | undefined {
  const whereConditions: (SQL | undefined)[] = [];

  // Global filter (case-insensitive partial match)
  if (globalFilter && globalFilterColumns?.length) {
    whereConditions.push(
      or(...globalFilterColumns.map((col) => ilike(col, `%${globalFilter}%`))),
    );
  }

  // Column-specific filters
  const columnFilterConditions = filters
    .map((filter) => buildFilterCondition(filter, columnMap))
    .filter((cond): cond is SQL => cond !== null);

  whereConditions.push(...columnFilterConditions);

  return whereConditions.length > 0 ? and(...whereConditions) : undefined;
}

// Build single filter condition
function buildFilterCondition<T extends Record<string, AnyPgColumn>>(
  filter: { id: string; value: unknown },
  columnMap: ColumnMap<T>,
): SQL | null {
  const { id, value } = filter;

  if (
    value == null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return null;
  }

  const column = columnMap[id as keyof T];
  if (!column) return null;

  // Handle arrays (multi-select)
  if (Array.isArray(value)) {
    if (value.length === 0) return null;

    // Boolean handling (e.g., ["true", "false"] → [true, false])
    if (
      typeof value[0] === "string" &&
      ["true", "false"].includes(value[0].toLowerCase())
    ) {
      const bools = value.map((v) =>
        typeof v === "string" ? v.toLowerCase() === "true" : Boolean(v),
      );
      return inArray(column, bools);
    }

    // Try number conversion (for IDs, types, etc.)
    const processedValues = value.map((v) => {
      if (typeof v === "string") {
        const num = Number(v);
        return Number.isNaN(num) ? v : num;
      }
      return v;
    });

    return inArray(column, processedValues);
  }

  // Single value
  if (typeof value === "string") {
    // Boolean?
    if (["true", "false"].includes(value.toLowerCase())) {
      return eq(column, value.toLowerCase() === "true");
    }
    // Number?
    const num = Number(value);
    if (!Number.isNaN(num)) {
      return eq(column, num);
    }
    // Fallback: case-insensitive text search
    return ilike(column, `%${value}%`);
  }

  if (typeof value === "boolean") {
    return eq(column, value);
  }

  if (typeof value === "number") {
    return eq(column, value);
  }

  return null;
}

// Build ORDER BY clause
export function buildOrderByClause(
  sorting: { id: string; desc: boolean }[],
  allowedColumns: string[],
  defaultOrder: SQL = sql`id DESC`,
): SQL {
  if (sorting.length === 0) return defaultOrder;

  const orderExpressions = sorting
    .filter((sort) => allowedColumns.includes(sort.id))
    .map((sort) => {
      // PostgreSQL requires quoted identifiers if they are reserved or camelCase
      // Drizzle's `sql.identifier()` safely quotes them as "column_name"
      const col = sql.identifier(sort.id);
      return sort.desc ? sql`${col} DESC` : sql`${col} ASC`;
    });

  return orderExpressions.length > 0
    ? sql`${sql.join(orderExpressions, sql`, `)}`
    : defaultOrder;
}

// Generic paginated query for PostgreSQL
export async function queryTableWithPagination(
  table: PgTable,
  where: SQL | undefined,
  orderBy: SQL,
  pageIndex: number,
  pageSize: number,
) {
  const offset = pageIndex * pageSize;

  const data = await db
    .select()
    .from(table)
    .where(where)
    .orderBy(orderBy)
    .limit(pageSize)
    .offset(offset);

  // PostgreSQL returns `bigint` for count → cast to number
  const totalResult = await db
    .select({ count: sql<number>`count(*)::int` }) // 👈 cast to int
    .from(table)
    .where(where);

  const total = totalResult[0]?.count ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  return {
    data,
    totalCount: total,
    totalPages,
    pageCount: totalPages, // compatible with TanStack Table
  };
}
