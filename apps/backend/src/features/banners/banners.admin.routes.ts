// features/banners/banners.admin.routes.ts
import { schemas } from "@repo/db";
import { sql } from "drizzle-orm";
import {
  buildOrderByClause,
  buildWhereClause,
  queryTableWithPagination,
  tableInputSchema,
} from "@/lib/tableUtils";
import { publicProcedure, router } from "@/utils/trpc";
import {
  bannerAllowedSortColumns,
  bannerColumns,
  bannerGlobalFilterColumns,
} from "./banners.admin.config";

const banners = schemas.not_related.banners;

export const adminBannerRouter = router({
  thirdBanner: publicProcedure
    .input(tableInputSchema)
    .query(async ({ input }) => {
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

      return await queryTableWithPagination(
        banners,
        where,
        orderBy,
        input.pagination.pageIndex,
        input.pagination.pageSize,
      );
    }),
});
