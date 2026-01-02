// features/banners/banners.admin.routes.ts
import { db } from "@repo/db";
import {
  users,
  usersInsertSchema,
  usersUpdateSchema,
} from "@repo/db/dist/schema/auth.schema";
import {
  categories,
  categoryInsertSchema,
  categoryUpdateSchema,
  subcategories,
} from "@repo/db/dist/schema/not-related.schema";
import {
  franchiseInsertSchema,
  franchises,
  franchiseUpdateSchema,
  profileInsertSchema,
  profiles,
  profileUpdateSchema,
} from "@repo/db/dist/schema/user.schema";
import { logger } from "@repo/logger";
import { TRPCError } from "@trpc/server";
import { eq, inArray, sql } from "drizzle-orm";
import z from "zod";
import {
  cloudinaryDeleteImageByPublicId,
  cloudinaryDeleteImagesByPublicIds,
} from "@/lib/cloudinary";
import { slugify } from "@/lib/slugify";
import {
  buildOrderByClause,
  buildWhereClause,
  tableInputSchema,
} from "@/lib/tableUtils";
import { hashPassword } from "@/utils/hashpass";
import { adminProcedure, router } from "@/utils/trpc";
import {
  usersAllowedSortColumns,
  usersColumns,
  usersGlobalFilterColumns,
} from "./franchise.admin.service";

export const adminFranchiseRouter = router({
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
      .from(franchises)
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
      .from(franchises)
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
    return { states, occupation };
  }),
  create: adminProcedure
    .input(
      usersInsertSchema
        .omit({ role: true })
        .extend(profileInsertSchema.omit({ userId: true }).shape)
        .extend(franchiseInsertSchema.omit({ userId: true }).shape),
    )
    .mutation(async ({ input }) => {
      console.log("we are here");
      const userData = usersInsertSchema.omit({ role: true }).parse(input);
      const profileData = profileInsertSchema
        .omit({ userId: true })
        .parse(input);
      const franchiseData = franchiseInsertSchema
        .omit({ userId: true })
        .parse(input);

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
          message: "Phone or Email already exists",
        });
      }

      if (!userData.password) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Password is required",
        });
      }

      const newUserData = (
        await db
          .insert(users)
          .values({
            ...userData,
            password: await hashPassword(userData.password),
            role: "franchises",
          })
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

      await db.insert(franchises).values({
        ...franchiseData,
        userId: newUserData?.id,
      });

      return { success: true, message: "Franchise created successfully" };
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
      const userData = await db.query.users.findFirst({
        where: (user, { eq }) => eq(user.id, input.id),
      });
      const profileData = await db.query.profiles.findFirst({
        where: (profile, { eq }) => eq(profile.userId, Number(userData?.id)),
      });
      const franchiseData = await db.query.franchises.findFirst({
        where: (franchise, { eq }) =>
          eq(franchise.userId, Number(userData?.id)),
      });
      return { userData, profileData, getStates, getOccupation, franchiseData };
    }),
  update: adminProcedure
    .input(
      usersInsertSchema
        .omit({ role: true })
        .extend(profileInsertSchema.omit({ userId: true }).shape)
        .extend(franchiseInsertSchema.omit({ userId: true }).shape),
    )
    .mutation(async ({ input }) => {
      const userData = usersUpdateSchema.omit({ role: true }).parse(input);
      const profileData = profileUpdateSchema
        .omit({ userId: true })
        .parse(input);
      const franchiseData = franchiseUpdateSchema
        .omit({ userId: true })
        .parse(input);
      const isEmailOrPhoneNumberExist = await db.query.users.findFirst({
        where: (user, { and, eq, or, ne }) =>
          and(
            or(
              eq(user.email, String(userData.email)),
              eq(user.phoneNumber, String(userData.phoneNumber)),
            ),
            ne(user.id, Number(userData.id)),
          ),
      });

      if (isEmailOrPhoneNumberExist) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already exists",
        });
      }

      //TODO : Update the code

      // if (!isProfileExists) {
      //   const newUserData = (
      //     await db.insert(users).values(userData).returning()
      //   )[0];
      //   if (!newUserData?.id) {
      //     throw new TRPCError({
      //       code: "INTERNAL_SERVER_ERROR",
      //       message: "Something went wrong in creating user",
      //     });
      //   }
      // } else {

      await db
        .update(users)
        .set({
          ...userData,
        })
        .where(eq(users.id, Number(userData.id)));

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
        .where(eq(profiles.userId, Number(userData.id)));

      // }
      await db
        .update(franchises)
        .set({
          gstNo: franchiseData.gstNo,
          referPrifixed: franchiseData.referPrifixed,
          lastAssignCode: franchiseData.lastAssignCode,
          employeeLimit: Number(franchiseData.employeeLimit),
        })
        .where(eq(franchises.userId, Number(userData.id)));

      return { success: true, message: "Franchise updated successfully" };
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
