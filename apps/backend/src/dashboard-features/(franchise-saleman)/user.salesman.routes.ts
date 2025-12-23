import { db } from "@repo/db";
import { users } from "@repo/db/dist/schema/auth.schema";
import { salesmen } from "@repo/db/dist/schema/user.schema";
import { desc, eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import {
  buildOrderByClause,
  buildWhereClause,
  tableInputSchema,
} from "@/lib/tableUtils";
import { router, salesmanProcedure } from "@/utils/trpc";
import {
  usersAllowedSortColumns,
  usersColumns,
  usersGlobalFilterColumns,
} from "./franchise.admin.service";
import { businessListings } from "@repo/db/dist/schema/business.schema";
import { hireListing } from "@repo/db/dist/schema/hire.schema";

export const salesmanUserRouter = router({
  businessList: salesmanProcedure
    .input(tableInputSchema)
    .query(async ({ input, ctx }) => {
      const where = buildWhereClause(
        input.filters,
        input.globalFilter,
        usersColumns,
        usersGlobalFilterColumns,
      );

      const orderBy = buildOrderByClause(
        input.sorting,
        usersAllowedSortColumns,
        desc(salesmen.createdAt),
      );

      // const orderBy = sql`created_at DESC`;

      const offset = input.pagination.pageIndex * input.pagination.pageSize;

      // const franchiseUser = alias(users, "franchise_user");
      // const salesmanUser = alias(users, "salesman_user");
      // const data = await db
      //   .select({
      //     id: salesmen.id,
      //     franchise_name: franchiseUser.displayName,
      //     refer_code: salesmen.referCode,
      //     salesman_name: salesmanUser.displayName,
      //     created_at: salesmen.createdAt,
      //   })
      //   .from(salesmen)
      //   .where(where)
      //   .orderBy(orderBy)
      //   .limit(input.pagination.pageSize)
      //   .leftJoin(franchises, eq(franchises.id, salesmen.franchiseId))
      //   .leftJoin(franchiseUser, eq(franchises.userId, franchiseUser.id))
      //   .leftJoin(salesmanUser, eq(salesmen.userId, salesmanUser.id))
      //   .offset(offset);

      const salesMan = await db.query.salesmen.findFirst({
        where: (salesman, { eq }) => eq(salesman.userId, ctx.userId),
      });

      console.log("Salesman", salesMan);

      const data = await db
        .select({
          id: salesmen.id,
          business_name: businessListings.name,
          refer_code: salesmen.referCode,
          created_at: salesmen.createdAt,
        })
        .from(salesmen)
        .where(where)
        .orderBy(orderBy)
        .limit(input.pagination.pageSize)
        .leftJoin(
          businessListings,
          eq(businessListings.salesmanId, Number(salesMan?.id)),
        )
        .offset(offset);
      // PostgreSQL returns `bigint` for count → cast to number
      console.log("Data");

      const totalResult = await db
        .select({
          count: sql<number>`count(distinct ${users.id})::int`,
        })
        .from(salesmen)
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
  hireList: salesmanProcedure
    .input(tableInputSchema)
    .query(async ({ input, ctx }) => {
      const where = buildWhereClause(
        input.filters,
        input.globalFilter,
        usersColumns,
        usersGlobalFilterColumns,
      );

      const orderBy = buildOrderByClause(
        input.sorting,
        usersAllowedSortColumns,
        desc(salesmen.createdAt),
      );

      // const orderBy = sql`created_at DESC`;

      const offset = input.pagination.pageIndex * input.pagination.pageSize;

      const data = await db
        .select({
          id: salesmen.id,
          hire_name: hireListing.name,
          refer_code: salesmen.referCode,
          created_at: salesmen.createdAt,
        })
        .from(salesmen)
        .where(where)
        .orderBy(orderBy)
        .limit(input.pagination.pageSize)
        .leftJoin(hireListing, eq(hireListing.salesmanId, ctx.userId))
        .offset(offset);
      // PostgreSQL returns `bigint` for count → cast to number
      const totalResult = await db
        .select({
          count: sql<number>`count(distinct ${users.id})::int`,
        })
        .from(salesmen)
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
