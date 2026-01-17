import { db } from "@repo/db";
import {
  users,
  usersInsertSchema,
  usersUpdateSchema,
} from "@repo/db/dist/schema/auth.schema";
import { businessListings } from "@repo/db/dist/schema/business.schema";
import { hireListing } from "@repo/db/dist/schema/hire.schema";
import {
  categories,
  categoryUpdateSchema,
  subcategories,
} from "@repo/db/dist/schema/not-related.schema";
import { planUserActive } from "@repo/db/dist/schema/plan.schema";
import {
  franchises,
  profileInsertSchema,
  profiles,
  profileUpdateSchema,
  salesmen,
  salesmenInsertSchema,
  salesmenUpdateSchema,
} from "@repo/db/dist/schema/user.schema";
import { logger } from "@repo/logger";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { and, count, desc, eq, inArray, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import z from "zod";
import {
  cloudinaryDeleteImageByPublicId,
  cloudinaryDeleteImagesByPublicIds,
} from "@/lib/cloudinary";
import {
  buildOrderByClause,
  buildWhereClause,
  tableInputSchema,
} from "@/lib/tableUtils";
import { franchisesProcedure, router } from "@/utils/trpc";
import {
  usersAllowedSortColumns,
  usersColumns,
  usersGlobalFilterColumns,
} from "./franchise.admin.service";
import { generateReferCode } from "./salesman.admin.service";

export const franchiseSalesmanRouter = router({
  list: franchisesProcedure
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

      const franchiseUser = alias(users, "franchise_user");
      const salesmanUser = alias(users, "salesman_user");
      const getThisFranchiseId = (
        await db.query.franchises.findFirst({
          where: (f, { eq }) => eq(f.userId, ctx.userId),
          columns: {
            id: true,
          },
        })
      )?.id;

      if (!getThisFranchiseId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "franchiseUser not found",
        });
      }
      const data = await db
        .select({
          id: salesmen.id,
          franchise_name: franchiseUser.displayName,
          refer_code: salesmen.referCode,
          salesman_name: salesmanUser.displayName,
          created_at: salesmen.createdAt,
        })
        .from(salesmen)
        .where(and(eq(salesmen.franchiseId, getThisFranchiseId), where))
        .orderBy(orderBy)
        .limit(input.pagination.pageSize)
        .leftJoin(franchises, eq(franchises.id, salesmen.franchiseId))
        .leftJoin(franchiseUser, eq(franchises.userId, franchiseUser.id))
        .leftJoin(salesmanUser, eq(salesmen.userId, salesmanUser.id))
        .offset(offset);

      // PostgreSQL returns `bigint` for count → cast to number
      const totalResult = await db
        .select({
          count: sql<number>`count(distinct ${salesmen.id})::int`,
        })
        .from(salesmen)
        .where(and(eq(salesmen.franchiseId, getThisFranchiseId), where));

      const total = totalResult[0]?.count ?? 0;
      const totalPages = Math.ceil(total / input.pagination.pageSize);

      return {
        data,
        totalCount: total,
        totalPages,
        pageCount: totalPages,
      };
    }),

  totalSalesman: franchisesProcedure.query(async ({ ctx }) => {
    const franchiseUser = await db.query.franchises.findFirst({
      where: (franchise, { eq }) => eq(franchise.userId, ctx.userId),
      columns: {
        id: true,
      },
    });
    if (!franchiseUser) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Franchise not found",
      });
    }
    const name = (
      await db.query.users.findFirst({
        where: (user, { eq }) => eq(user.id, ctx.userId),
        columns: {
          displayName: true,
        },
      })
    )?.displayName;
    const referCode = (
      await db.query.salesmen.findFirst({
        where: (salesman, { eq }) => eq(salesman.userId, ctx.userId),
        columns: {
          referCode: true,
        },
      })
    )?.referCode;
    const businessSq = await db
      .select({ count: count() })
      .from(businessListings)
      .innerJoin(salesmen, eq(salesmen.id, businessListings.salesmanId))
      .where(eq(salesmen.franchiseId, franchiseUser.id));

    const hireSq = await db
      .select({ count: count() })
      .from(hireListing)
      .innerJoin(salesmen, eq(salesmen.id, hireListing.salesmanId))
      .where(eq(salesmen.franchiseId, franchiseUser.id));

    const totalUsers =
      Number(businessSq[0]?.count ?? 0) + Number(hireSq[0]?.count ?? 0);

    const allSalesman =
      (
        await db
          .select({
            count: sql<number>`count(distinct ${salesmen.id})::int`,
          })
          .from(salesmen)
          .where(eq(salesmen.franchiseId, franchiseUser.id))
      )[0]?.count ?? 0;

    const paidBusinessUsers =
      (
        await db
          .select({
            count: sql<number>`count(distinct ${planUserActive.id})::int`,
          })
          .from(planUserActive)
          .innerJoin(
            businessListings,
            eq(planUserActive.userId, businessListings.userId),
          )
          .innerJoin(salesmen, eq(salesmen.id, businessListings.salesmanId))
          .where(eq(salesmen.franchiseId, franchiseUser.id))
      )[0]?.count ?? 0;

    const paidHireUsers =
      (
        await db
          .select({
            count: sql<number>`count(distinct ${planUserActive.id})::int`,
          })
          .from(planUserActive)
          .innerJoin(hireListing, eq(planUserActive.userId, hireListing.userId))
          .innerJoin(salesmen, eq(salesmen.id, hireListing.salesmanId))
          .where(eq(salesmen.franchiseId, franchiseUser.id))
      )[0]?.count ?? 0;

    return {
      name,
      hireSq,
      referCode,
      totalUsers,
      businessSq,
      allSalesman,
      paidHireUsers,
      paidBusinessUsers,
    };
  }),
  add: franchisesProcedure.query(async ({ ctx }) => {
    const states = await db.query.states.findMany();
    const occupation = await db.query.occupation.findMany();
    const franchise = await db.query.franchises.findFirst({
      where: (franchise, { eq }) => eq(franchise.userId, ctx.userId),
      columns: {
        referPrifixed: true,
        lastAssignCode: true,
      },
    });
    const salutation = await db.query.salutation.findMany();
    return { states, occupation, franchise, salutation };
  }),
  getReferCode: franchisesProcedure
    .input(z.object({ franchiseId: z.number() }))
    .query(async ({ input }) => {
      const franchise = await db.query.franchises.findFirst({
        where: (franchise, { eq }) => eq(franchise.userId, input.franchiseId),
        columns: {
          referPrifixed: true,
          lastAssignCode: true,
        },
      });
      if (!franchise)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Franchise not found",
        });
      const prifix = franchise.referPrifixed;
      const lastAssignCode = franchise.lastAssignCode;
      const code = await generateReferCode(lastAssignCode, prifix);
      return code;
    }),
  create: franchisesProcedure
    .input(
      usersInsertSchema
        .omit({ role: true })
        .extend(profileInsertSchema.omit({ userId: true }).shape)
        .extend(
          salesmenInsertSchema.omit({ userId: true, franchiseId: true }).shape,
        ),
    )
    .mutation(async ({ input, ctx }) => {
      const userData = usersInsertSchema.omit({ role: true }).parse(input);
      const profileData = profileInsertSchema
        .omit({ userId: true })
        .parse(input);
      const salesmenData = salesmenInsertSchema
        // .extend({ nextNumber: z.number() })
        .omit({ userId: true, franchiseId: true })
        .parse(input);

      const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT));
      const hashPassword = await bcrypt.hash(String(userData?.password), salt);

      const franchise = await db.query.franchises.findFirst({
        where: (franchise, { eq }) => eq(franchise.userId, ctx.userId),
      });
      const isEmailOrPhoneNumberExist = await db.query.users.findFirst({
        where: (user, { eq, or }) =>
          or(
            eq(user.email, String(userData.email)),
            eq(user.phoneNumber, String(userData.phoneNumber)),
          ),
      });
      if (isEmailOrPhoneNumberExist) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already exists",
        });
      }
      const referCode = franchise?.referPrifixed + salesmenData.referCode;
      console.log("refer code", franchise);

      const newUserData = (
        await db
          .insert(users)
          .values({ ...userData, role: "salesman", password: hashPassword })
          .returning()
      )[0];
      if (!newUserData?.id) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong in creating user",
        });
      }

      await db.insert(profiles).values({
        ...profileData,
        userId: newUserData?.id,
      });

      await db.insert(salesmen).values({
        ...salesmenData,
        referCode: referCode,
        userId: newUserData?.id,
        franchiseId: Number(franchise?.id),
      });

      await db.update(franchises).set({
        lastAssignCode: Number(salesmenData.referCode),
      });
      return { success: true, message: "Salesmen created successfully" };
    }),
  edit: franchisesProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const getStates = await db.query.states.findMany();
      const getOccupation = await db.query.occupation.findMany();
      const getSalutation = await db.query.salutation.findMany();
      const salesmanData = await db.query.salesmen.findFirst({
        where: (salesman, { eq }) => eq(salesman.id, Number(input?.id)),
      });

      const userData = await db.query.users.findFirst({
        where: (user, { eq }) => eq(user.id, Number(salesmanData?.userId)),
      });

      const profileData = await db.query.profiles.findFirst({
        where: (profile, { eq }) => eq(profile.userId, Number(userData?.id)),
      });

      return {
        userData,
        getStates,
        profileData,
        salesmanData,
        getOccupation,
        getSalutation,
      };
    }),
  update: franchisesProcedure
    .input(
      usersUpdateSchema
        .omit({ role: true })
        .extend(profileUpdateSchema.shape)
        .extend(salesmenUpdateSchema.omit({ franchiseId: true }).shape),
    )
    .mutation(async ({ input, ctx }) => {
      const userData = usersUpdateSchema.omit({ role: true }).parse(input);
      const profileData = profileUpdateSchema.parse(input);
      const salesmenData = salesmenUpdateSchema
        .omit({ franchiseId: true })
        .parse(input);

      logger.info("input is", { userData: profileData });
      const isEmailOrPhoneNumberExist = await db.query.users.findFirst({
        where: (user, { and, ne, eq, or }) =>
          and(
            or(
              eq(user.email, String(userData.email)),
              eq(user.phoneNumber, String(userData.phoneNumber)),
            ),
            ne(user.id, Number(profileData.userId)),
          ),
      });
      if (isEmailOrPhoneNumberExist) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already exists",
        });
      }

      await db
        .update(users)
        .set({
          ...userData,
        })
        .where(eq(users.id, Number(profileData.userId)));

      await db
        .update(profiles)
        .set({
          profileImage: profileData.profileImage,
          salutation: profileData.salutation,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          dob: profileData.dob,
          occupation: profileData.occupation,
          maritalStatus: profileData.maritalStatus,
          address: profileData.address,
          // area: profileData.area,
          city: profileData.city,
          pincode: profileData.pincode,
          state: profileData.state,
        })
        .where(eq(profiles.userId, Number(profileData.userId)));

      await db
        .update(salesmen)
        .set({
          ...salesmenData,
        })
        .where(eq(salesmen.userId, Number(profileData.userId)));
      return { success: true, message: "Salesmen updated successfully" };
    }),

  multidelete: franchisesProcedure
    .input(
      z.object({
        ids: z.array(z.number()),
      }),
    )
    .mutation(async ({ input }) => {
      console.log("Input", input);

      await db.delete(salesmen).where(inArray(salesmen.id, input.ids));
      return { success: true };
    }),
  multiactive: franchisesProcedure
    .input(
      z.array(
        z.object({
          id: z.number(),
          isActive: z.boolean(),
        }),
      ),
    )
    .mutation(async ({ input }) => {
      await db
        .update(categories)
        .set({
          status: sql`CASE ${categories.id} 
            ${sql.join(
              input.map(
                (item) =>
                  sql`WHEN ${item.id} THEN ${item.isActive ? sql`true` : sql`false`}`,
              ),
              sql` `,
            )}
                ELSE ${categories.status} 
                END`,
        })
        .where(
          inArray(
            categories.id,
            input.map((item) => item.id),
          ),
        );

      return { success: true };
    }),
  multipopular: franchisesProcedure
    .input(
      z.array(
        z.object({
          id: z.number(),
          isActive: z.boolean(),
        }),
      ),
    )
    .mutation(async ({ input }) => {
      await db
        .update(categories)
        .set({
          isPopular: sql`CASE ${categories.id} 
            ${sql.join(
              input.map(
                (item) =>
                  sql`WHEN ${item.id} THEN ${item.isActive ? sql`true` : sql`false`}`,
              ),
              sql` `,
            )} 
                ELSE ${categories.isPopular} 
                END`,
        })
        .where(
          inArray(
            categories.id,
            input.map((item) => item.id),
          ),
        );

      return { success: true };
    }),
});
