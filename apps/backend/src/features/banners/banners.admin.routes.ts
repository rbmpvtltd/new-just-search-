// features/banners/banners.admin.routes.ts
import { db, schemas } from "@repo/db";
import { sql } from "drizzle-orm";
import {
  buildOrderByClause,
  buildWhereClause,
  tableInputSchema,
} from "@/lib/tableUtils";
import { publicProcedure, router } from "@/utils/trpc";
import {
  bannerAllowedSortColumns,
  bannerColumns,
  bannerGlobalFilterColumns,
} from "./banners.admin.service";

const banners = schemas.not_related.banners;

export const adminBannerRouter = router({
  //TODO: add admin procedure
  list: publicProcedure.input(tableInputSchema).query(async ({ input }) => {
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
});
