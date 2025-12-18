import { features } from "node:process";
import { db } from "@repo/db";
import { users, usersInsertSchema } from "@repo/db/dist/schema/auth.schema";
import {
  categories,
  categoryUpdateSchema,
  subcategories,
} from "@repo/db/dist/schema/not-related.schema";
import {
  franchises,
  profileInsertSchema,
  profiles,
  salesmen,
  salesmenInsertSchema,
} from "@repo/db/dist/schema/user.schema";
import { logger } from "@repo/logger";
import { TRPCError } from "@trpc/server";
import { desc, eq, inArray, sql } from "drizzle-orm";
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

export const franchiseSalemanRouter = router({
  list: franchisesProcedure.input(tableInputSchema).query(async ({ input }) => {
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
    const data = await db
      .select({
        id: salesmen.id,
        franchise_name: franchiseUser.displayName,
        refer_code: salesmen.referCode,
        salesman_name: salesmanUser.displayName,
        created_at: salesmen.createdAt,
      })
      .from(salesmen)
      .where(where)
      .orderBy(orderBy)
      .limit(input.pagination.pageSize)
      .leftJoin(franchises, eq(franchises.id, salesmen.franchiseId))
      .leftJoin(franchiseUser, eq(franchises.userId, franchiseUser.id))
      .leftJoin(salesmanUser, eq(salesmen.userId, salesmanUser.id))
      .offset(offset);

    // PostgreSQL returns `bigint` for count → cast to number
    const totalResult = await db
      .select({
        count: sql<number>`count(distinct ${users.id})::int`,
      })
      .from(users)
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
  add: franchisesProcedure.query(async ({ ctx }) => {
    const states = await db.query.states.findMany();
    const occupation = await db.query.occupation.findMany();
    // const prifix = await db.query.franchises.findFirst({
    //   where: (franchise, { eq }) => eq(franchise.userId, ctx.userId),
    // });
    // const franchise = await db.query.users.findFirst({
    //   columns: {
    //     displayName: true,
    //     id: true,
    //   },
    //   where: (user, { eq }) => eq(user.id, ctx.userId),
    // });

    console.log("Hii");

    const franchise = await db
      .select({
        displayName: users.displayName,
        referPrifixed: franchises.referPrifixed,
        id: franchises.id,
      })
      .from(franchises)
      .where(eq(franchises.userId, ctx.userId))
      .leftJoin(users, eq(franchises.userId, users.id));

    console.log("Franchice", franchise);

    return { states, occupation, franchise };
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
          .values({ ...userData, role: "salesman" })
          .returning()
      )[0];
      if (!newUserData?.id) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong in creating user",
        });
      }

      try {
        await db.insert(profiles).values({
          ...profileData,
          userId: newUserData?.id,
        });
      } catch (error) {
        console.log("Error", error);
        logger.info("Error", error);
      }
      console.log("refer code", profiles);
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
      const getFranchise = await db.query.users.findMany({
        where: (user, { eq }) => eq(user.role, "franchises"),
      });
      const franchiseData = await db.query.franchises.findFirst({
        where: (franchise, { eq }) => eq(franchise.id, Number(input?.id)),
      });

      const userData = await db.query.users.findFirst({
        where: (user, { eq }) => eq(user.id, 8),
      });
      const profileData = await db.query.profiles.findFirst({
        where: (profile, { eq }) => eq(profile.userId, Number(userData?.id)),
      });

      const salesmanData = await db.query.salesmen.findFirst({
        where: (salesman, { eq }) =>
          eq(salesman.franchiseId, Number(input?.id)),
      });
      return {
        userData,
        profileData,
        getStates,
        getOccupation,
        salesmanData,
        franchiseData,
        getFranchise,
      };
    }),
  update: franchisesProcedure
    .input(categoryUpdateSchema)
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      if (!id)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please pass id field",
        });
      const olddata = (
        await db.select().from(categories).where(eq(categories.id, id))
      )[0];
      if (olddata?.photo && olddata?.photo !== updateData.photo) {
        await cloudinaryDeleteImageByPublicId(olddata.photo);
      }
      await db.update(categories).set(updateData).where(eq(categories.id, id));
      return { success: true };
    }),
  multidelete: franchisesProcedure
    .input(
      z.object({
        ids: z.array(z.number()),
      }),
    )
    .mutation(async ({ input }) => {
      //TODO: remove subcategory of these categories;
      const allSeletedPhoto = await db
        .select({
          photo: categories.photo,
        })
        .from(categories)
        .where(inArray(categories.id, input.ids));
      await cloudinaryDeleteImagesByPublicIds(
        allSeletedPhoto.map((item) => item.photo),
      );
      //TODO: test that subcategory is also deleting
      await db
        .delete(subcategories)
        .where(inArray(subcategories.categoryId, input.ids));
      await db.delete(categories).where(inArray(categories.id, input.ids));
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
