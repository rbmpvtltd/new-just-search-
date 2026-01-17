import { db } from "@repo/db";
import { businessListings } from "@repo/db/dist/schema/business.schema";
import { hireListing } from "@repo/db/dist/schema/hire.schema";
import { planUserActive } from "@repo/db/dist/schema/plan.schema";
import { logger } from "@repo/logger";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, sql } from "drizzle-orm";
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
        desc(businessListings.createdAt),
      );

      // const orderBy = sql`created_at DESC`;

      const offset = input.pagination.pageIndex * input.pagination.pageSize;

      const getThisSalesmanId = (
        await db.query.salesmen.findFirst({
          where: (salesman, { eq }) => eq(salesman.userId, ctx.userId),
          columns: {
            id: true,
          },
        })
      )?.id;

      if (!getThisSalesmanId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Salesman not found",
        });
      }
      const data = await db
        .select({
          id: businessListings.id,
          business_name: businessListings.name,
          created_at: businessListings.createdAt,
        })
        .from(businessListings)
        .where(and(eq(businessListings.salesmanId, getThisSalesmanId), where))
        .orderBy(orderBy)
        .limit(input.pagination.pageSize)

        .offset(offset);
      // PostgreSQL returns `bigint` for count → cast to number
      console.log("Data");
      logger.info("data is", { data: data });
      const totalResult = await db
        .select({
          count: sql<number>`count(distinct ${businessListings.id})::int`,
        })
        .from(businessListings)
        .where(and(eq(businessListings.salesmanId, getThisSalesmanId), where));

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
        desc(hireListing.createdAt),
      );

      // const orderBy = sql`created_at DESC`;

      const offset = input.pagination.pageIndex * input.pagination.pageSize;

      const getThisSalesmanId = (
        await db.query.salesmen.findFirst({
          where: (salesman, { eq }) => eq(salesman.userId, ctx.userId),
          columns: {
            id: true,
          },
        })
      )?.id;

      if (!getThisSalesmanId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Salesman not found",
        });
      }
      const data = await db
        .select({
          id: hireListing.id,
          hire_name: hireListing.name,
          created_at: hireListing.createdAt,
        })
        .from(hireListing)
        .where(and(eq(hireListing.salesmanId, getThisSalesmanId), where))
        .orderBy(orderBy)
        .limit(input.pagination.pageSize)

        .offset(offset);
      // PostgreSQL returns `bigint` for count → cast to number
      console.log("Data");
      logger.info("data is", { data: data });
      const totalResult = await db
        .select({
          count: sql<number>`count(distinct ${hireListing.id})::int`,
        })
        .from(hireListing)
        .where(and(eq(hireListing.salesmanId, getThisSalesmanId), where));

      const total = totalResult[0]?.count ?? 0;
      const totalPages = Math.ceil(total / input.pagination.pageSize);

      return {
        data,
        totalCount: total,
        totalPages,
        pageCount: totalPages,
      };
    }),

  totalUsers: salesmanProcedure.query(async ({ ctx }) => {
    const saleman = await db.query.salesmen.findFirst({
      where: (salesman, { eq }) => eq(salesman.userId, ctx.userId),
      columns: {
        id: true,
        referCode: true,
      },
    });

    if (!saleman) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Salesman not found",
      });
    }
    const name = (
      await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, ctx.userId),
        columns: {
          displayName: true,
        },
      })
    )?.displayName;
    const allBusiness =
      (
        await db
          .select({
            count: sql<number>`count(distinct ${businessListings.id})::int`,
          })
          .from(businessListings)
          .where(eq(businessListings.salesmanId, saleman.id))
      )[0]?.count ?? 0;

    const paidUsers =
      (
        await db
          .select({
            count: sql<number>`count(distinct ${planUserActive.id})::int`,
          })
          .from(planUserActive)
          .leftJoin(
            businessListings,
            eq(planUserActive.userId, businessListings.userId),
          )
          .leftJoin(hireListing, eq(planUserActive.userId, hireListing.userId))
          .where(eq(businessListings.salesmanId, saleman.id))
      )[0]?.count ?? 0;

    const allhire =
      (
        await db
          .select({
            count: sql<number>`count(distinct ${hireListing.id})::int`,
          })
          .from(hireListing)
          .where(eq(hireListing.salesmanId, saleman.id))
      )[0]?.count ?? 0;

    return {
      allBusiness,
      allhire,
      paidUsers,
      name,
      referCode: saleman.referCode,
    };
  }),
});
