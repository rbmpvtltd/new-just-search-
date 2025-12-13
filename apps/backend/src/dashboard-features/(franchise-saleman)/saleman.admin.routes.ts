// features/banners/banners.admin.routes.ts
import { db } from "@repo/db";
import { users, usersInsertSchema } from "@repo/db/dist/schema/auth.schema";
import {
  categories,
  categoryInsertSchema,
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
import { eq, inArray, sql } from "drizzle-orm";
import slugify from "slugify";
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
import { adminProcedure, router } from "@/utils/trpc";
import {
  usersAllowedSortColumns,
  usersColumns,
  usersGlobalFilterColumns,
} from "./franchise.admin.service";
import { generateReferCode } from "./saleman.admin.service";

export const adminSalemanRouter = router({
  list: adminProcedure.input(tableInputSchema).query(async ({ input }) => {
    const where = buildWhereClause(
      input.filters,
      input.globalFilter,
      usersColumns,
      usersGlobalFilterColumns,
    );

    const orderBy = buildOrderByClause(
      input.sorting,
      usersAllowedSortColumns,
      sql`created_at DESC`,
    );

    // const orderBy = sql`created_at DESC`;

    const offset = input.pagination.pageIndex * input.pagination.pageSize;

    const data = await db
      .select()
      .from(salesmen)
      .where(where)
      .orderBy(orderBy)
      .limit(input.pagination.pageSize)
      // .leftJoin(categories, eq(subcategories.categoryId, categories.id))
      .offset(offset);

    // PostgreSQL returns `bigint` for count → cast to number
    const totalResult = await db
      .select({
        count: sql<number>`count(distinct ${users.id})::int`,
      })
      .from(users)
      // .leftJoin(categories, eq(subcategories.categoryId, categories.id))
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
  add: adminProcedure.query(async () => {
    const states = await db.query.states.findMany();
    const occupation = await db.query.occupation.findMany();
    const franchise = await db.query.users.findMany({
      columns: {
        displayName: true,
        id: true,
      },
      where: (user, { eq }) => eq(user.role, "franchises"),
    });

    return { states, occupation, franchise };
  }),
  getReferCode: adminProcedure
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
  create: adminProcedure
    .input(
      usersInsertSchema
        .omit({ role: true })
        .extend(profileInsertSchema.omit({ userId: true }).shape)
        .extend(salesmenInsertSchema.extend({ nextNumber: z.number() }).shape),
    )
    .mutation(async ({ input }) => {
      const userData = usersInsertSchema.omit({ role: true }).parse(input);
      const profileData = profileInsertSchema
        .omit({ userId: true })
        .parse(input);
      const salesmenData = salesmenInsertSchema
        .extend({ nextNumber: z.number() })
        .parse(input);

      const franchise = await db.query.franchises.findFirst({
        where: (franchise, { eq }) => eq(franchise.userId, input.franchiseId),
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

      await db.insert(profiles).values({
        ...profileData,
        userId: newUserData?.id,
      });

      await db.insert(salesmen).values({
        ...salesmenData,
        franchiseId: Number(franchise?.id),
      });

      await db.update(franchises).set({
        lastAssignCode: Number(salesmenData.nextNumber),
      });
      return { success: true, message: "Salesmen created successfully" };
    }),
  edit: adminProcedure
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
  update: adminProcedure
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
  multidelete: adminProcedure
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
  multiactive: adminProcedure
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
  multipopular: adminProcedure
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
