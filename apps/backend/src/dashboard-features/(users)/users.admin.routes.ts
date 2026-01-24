// features/banners/banners.admin.routes.ts
import { db } from "@repo/db";
import {
  users,
  usersInsertSchema,
  usersUpdateSchema,
} from "@repo/db/dist/schema/auth.schema";
import {
  categories,
} from "@repo/db/dist/schema/not-related.schema";
import {
  profileInsertSchema,
  profiles,
  profileUpdateSchema,
} from "@repo/db/dist/schema/user.schema";
import { TRPCError } from "@trpc/server";
import { eq, inArray, sql } from "drizzle-orm";
import z from "zod";
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
} from "./users.admin.service";

export const adminUsersRouter = router({
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
      .from(users)
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
    const salutation = await db.query.salutation.findMany();
    return { states, occupation, salutation };
  }),
  create: adminProcedure
    .input(
      usersInsertSchema.extend(
        profileInsertSchema.omit({ userId: true }).shape,
      ),
    )
    .mutation(async ({ input }) => {
      console.log("we are here");
      const userData = usersInsertSchema.parse(input);
      const profileData = profileInsertSchema
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
          message: "Email already exists",
        });
      }

      const newUserData = (
        await db.insert(users).values(userData).returning()
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

      return { success: true, message: "Profile created successfully" };
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
      const getSalutation = await db.query.salutation.findMany();
      const userData = await db.query.users.findFirst({
        where: (user, { eq }) => eq(user.id, input.id),
      });

      const profileData = await db.query.profiles.findFirst({
        where: (profile, { eq }) => eq(profile.userId, Number(userData?.id)),
      });

      return { userData, profileData, getStates, getOccupation, getSalutation };
    }),
  update: adminProcedure
    .input(usersUpdateSchema.extend(profileUpdateSchema.shape))
    .mutation(async ({ input }) => {
      const userData = usersUpdateSchema.parse(input);
      const profileData = profileUpdateSchema
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
      const isProfileExists = await db.query.profiles.findFirst({
        where: (profile, { eq }) => eq(profile.id, Number(profileData?.id)),
      });

      if (!isProfileExists) {
        const newUserData = (
          await db.insert(users).values(userData).returning()
        )[0];
        if (!newUserData?.id) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong in creating user",
          });
        }
      } else {
        await db
          .update(users)
          .set({
            ...userData,
          })
          .where(eq(users.id, Number(userData.id)));
      }

      await db
        .update(profiles)
        .set({
          ...profileData,
        })
        .where(eq(profiles.userId, Number(userData.id)));

      return { success: true, message: "Profile updated successfully" };
    }),
  // multidelete: adminProcedure
  //   .input(
  //     z.object({
  //       ids: z.array(z.number()),
  //     }),
  //   )
  //   .mutation(async ({ input }) => {
  //     const allSeletedPhoto = await db
  //       .select({
  //         photo: categories.photo,
  //       })
  //       .from(categories)
  //       .where(inArray(categories.id, input.ids));
  //     await cloudinaryDeleteImagesByPublicIds(
  //       allSeletedPhoto.map((item) => item.photo),
  //     );
  //     await db
  //       .delete(subcategories)
  //       .where(inArray(subcategories.categoryId, input.ids));
  //     await db.delete(categories).where(inArray(categories.id, input.ids));
  //     return { success: true };
  //   }),
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
