// features/banners/banners.admin.routes.ts
import { db } from "@repo/db";
import { users } from "@repo/db/src/schema/auth.schema";
import {
  businessCategories,
  businessListings,
  businessSubcategories,
} from "@repo/db/src/schema/business.schema";
import {
  categories,
  categoryInsertSchema,
  categoryUpdateSchema,
  cities,
  subcategories,
} from "@repo/db/src/schema/not-related.schema";
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
  businessAllowedSortColumns,
  businessColumns,
  businessGlobalFilterColumns,
} from "./business.admin.service";

export const adminBusinessRouter = router({
  list: adminProcedure.input(tableInputSchema).query(async ({ input }) => {
    const where = buildWhereClause(
      input.filters,
      input.globalFilter,
      businessColumns,
      businessGlobalFilterColumns,
    );

    const orderBy = buildOrderByClause(
      input.sorting,
      businessAllowedSortColumns,
      sql`created_at DESC`,
    );

    // const orderBy = sql`created_at DESC`;

    const offset = input.pagination.pageIndex * input.pagination.pageSize;

    const newData = await db
      .select()
      .from(businessListings)
      // .where(where)
      // .orderBy(orderBy)
      .limit(10)
      .leftJoin(users, eq(businessListings.userId, users.id))
      // .leftJoin(cities, eq(businessListings.cityId, cities.id)) // TODO: I commited this to avoid error future me you must remove this commit
      .leftJoin(
        businessSubcategories,
        eq(businessListings.id, businessSubcategories.businessId),
      )
      .leftJoin(
        subcategories,
        eq(businessSubcategories.subcategoryId, subcategories.id),
      )
      .leftJoin(
        businessCategories,
        eq(businessListings.id, businessCategories.businessId),
      )
      .leftJoin(categories, eq(businessCategories.categoryId, categories.id))
      .offset(0);

    console.log(newData);
    const data = await db
      .select({
        id: businessListings.id,
        photo: businessListings.photo,
        name: businessListings.name,
        phone: users.phoneNumber,
        city: cities.city,
        category:
          sql<string>`string_agg(DISTINCT ${categories.title}, ', ' ORDER BY ${categories.title})`.as(
            "category",
          ),
        subcategories:
          sql<string>`string_agg(DISTINCT ${subcategories.name}, ', ' ORDER BY ${subcategories.name})`.as(
            "subcategories",
          ),
        status: businessListings.status,
        created_at: businessListings.createdAt,
      })
      .from(businessListings)
      .where(where)
      .orderBy(orderBy)
      .limit(input.pagination.pageSize)
      .leftJoin(users, eq(businessListings.userId, users.id))
      .leftJoin(cities, eq(businessListings.city, cities.id)) // TODO: I commited this to avoid error future me you must remove this commit
      .leftJoin(
        businessSubcategories,
        eq(businessListings.id, businessSubcategories.businessId),
      )
      .leftJoin(
        subcategories,
        eq(businessSubcategories.subcategoryId, subcategories.id),
      )
      .leftJoin(
        businessCategories,
        eq(businessListings.id, businessCategories.businessId),
      )
      .leftJoin(categories, eq(businessCategories.categoryId, categories.id))
      .offset(offset)
      .groupBy(
        businessListings.id,
        businessListings.photo,
        businessListings.name,
        users.phoneNumber,
        businessListings.status,
        businessListings.createdAt,
      );

    // PostgreSQL returns `bigint` for count → cast to number
    const totalResult = await db
      .select({ count: sql<number>`count(*)::int` }) // 👈 cast to int
      .from(businessListings)
      .leftJoin(users, eq(businessListings.userId, users.id))
      .leftJoin(cities, eq(businessListings.city, cities.id)) // TODO: I commited this to avoid error future me you must remove this commit
      .leftJoin(
        businessSubcategories,
        eq(businessListings.id, businessSubcategories.businessId),
      )
      .leftJoin(
        subcategories,
        eq(businessSubcategories.subcategoryId, subcategories.id),
      )
      .leftJoin(
        businessCategories,
        eq(businessListings.id, businessCategories.businessId),
      )
      .leftJoin(categories, eq(businessCategories.categoryId, categories.id))
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
    return;
  }),
  create: adminProcedure
    .input(
      categoryInsertSchema.omit({
        slug: true,
      }),
    )
    .mutation(async ({ input }) => {
      const slug = slugify(input.title);
      await db.insert(categories).values({ ...input, slug });
      return { success: true };
    }),
  edit: adminProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const data = await db
        .select()
        .from(categories)
        .where(eq(categories.id, input.id));
      return data[0];
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
