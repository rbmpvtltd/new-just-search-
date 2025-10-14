// features/banners/banners.admin.routes.ts
import { db } from "@repo/db";
import {
  bannerInsertSchema,
  banners,
} from "@repo/db/src/schema/not-related.schema";
import { sql } from "drizzle-orm";
import {
  buildOrderByClause,
  buildWhereClause,
  tableInputSchema,
} from "@/lib/tableUtils";
import { adminProcedure, router } from "@/utils/trpc";
import {
  bannerAllowedSortColumns,
  bannerColumns,
  bannerGlobalFilterColumns,
} from "./banners.admin.service";

export const adminBannerRouter = router({
  list: adminProcedure.input(tableInputSchema).query(async ({ input }) => {
    const where = buildWhereClause(
      input.filters,
      input.globalFilter,
      bannerColumns,
      bannerGlobalFilterColumns,
    );

    const orderBy = buildOrderByClause(
      input.sorting,
      bannerAllowedSortColumns,
      sql`id DESC`,
    );

    const offset = input.pagination.pageIndex * input.pagination.pageSize;

    const data = await db
      .select()
      .from(banners)
      .where(where)
      .orderBy(orderBy)
      .limit(input.pagination.pageSize)
      .offset(offset);

    // PostgreSQL returns `bigint` for count → cast to number
    const totalResult = await db
      .select({ count: sql<number>`count(*)::int` }) // 👈 cast to int
      .from(banners)
      .where(where);

    const total = totalResult[0]?.count ?? 0;
    const totalPages = Math.ceil(total / input.pagination.pageSize);

    return {
      data,
      totalCount: total,
      totalPages,
      pageCount: totalPages,
    };
  }),
  add: adminProcedure.mutation(async () => {
    return;
  }),
  create: adminProcedure.input(bannerInsertSchema).mutation(async () => {
    return;
  }),
});
