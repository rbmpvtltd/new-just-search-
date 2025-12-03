// features/banners/banners.admin.routes.ts
import { db } from "@repo/db";
import { users } from "@repo/db/dist/schema/auth.schema";
import {
  businessCategories,
  businessInsertSchema,
  businessListings,
  businessPhotos,
  businessSubcategories,
} from "@repo/db/dist/schema/business.schema";
import {
  categories,
  categoryUpdateSchema,
  cities,
  subcategories,
} from "@repo/db/dist/schema/not-related.schema";
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
import { adminProcedure, router, visitorProcedure } from "@/utils/trpc";
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

    const offset = input.pagination.pageIndex * input.pagination.pageSize;

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
        cities.id,
        businessListings.status,
        businessListings.createdAt,
      );

    const totalResult = await db
      .select({
        count: sql<number>`count(distinct ${businessListings.id})::int`,
      })
      .from(businessListings)
      .where(where)
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
      .leftJoin(users, eq(businessListings.userId, users.id));
    // .groupBy(businessListings.id);

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
    const getBusinessCategories = await db.query.categories.findMany({
      where: (categories, { eq }) => eq(categories.type, 1),
    });
    const getStates = await db.query.states.findMany();
    const users = await db.query.users.findMany({
      where: (user, { eq }) => eq(user.role, "visiter"),
      columns: {
        displayName: true,
        id: true,
      },
    });
    return {
      users,
      getBusinessCategories,
      getStates,
    };
  }),

  getSubCategories: visitorProcedure
    .input(z.object({ categoryId: z.number() }))
    .query(async ({ input }) => {
      const businessSubCategories = await db.query.subcategories.findMany({
        where: (subcategories, { eq }) =>
          eq(subcategories.categoryId, input.categoryId),
      });
      return businessSubCategories;
    }),

  getCities: visitorProcedure
    .input(z.object({ state: z.number() }))
    .query(async ({ input }) => {
      const cities = await db.query.cities.findMany({
        where: (cities, { eq }) => eq(cities.stateId, input.state),
      });
      return cities;
    }),

  create: adminProcedure
    .input(businessInsertSchema)
    .mutation(async ({ input }) => {
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, input.userId),
      });
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });
      }

      const existingBusiness = await db.query.businessListings.findFirst({
        where: (businessListings, { eq }) =>
          eq(businessListings.userId, input.userId),
      });

      if (existingBusiness) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Business already exist",
        });
      }

      const isStateExists = await db.query.states.findFirst({
        where: (states, { eq }) => eq(states.id, input.state),
      });

      if (!isStateExists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "State not found",
        });
      }

      const isCityExists = await db.query.cities.findFirst({
        where: (cities, { eq }) => eq(cities.id, input.city),
      });
      if (!isCityExists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "City not found",
        });
      }

      const slugifyName = slugify(input.name, {
        lower: true,
        strict: true,
      });
      const [createBusiness] = await db
        .insert(businessListings)
        .values({
          ...input,
          status: "Approved",
          slug: slugifyName,
        })
        .returning({
          id: businessListings.id,
        });
      if (!createBusiness) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Failed to create business",
        });
      }
      const businessId = createBusiness.id;
      await db.insert(businessCategories).values({
        businessId,
        categoryId: input.categoryId,
      });

      if (input.subcategoryId.length > 0) {
        await db.insert(businessSubcategories).values(
          input.subcategoryId.map((subCategoryId) => ({
            businessId,
            subcategoryId: Number(subCategoryId),
          })),
        );
      }

      const allPhotos = [
        input.image1,
        input.image2,
        input.image3,
        input.image4,
        input.image5,
      ].filter(Boolean); // removes empty or null values

      if (allPhotos.length > 0) {
        await db.insert(businessPhotos).values(
          allPhotos.map((photo) => ({
            businessId: businessId,
            photo,
          })),
        );
      }

      await db
        .update(users)
        .set({
          role: "business",
          displayName: input.name,
        })
        .where(eq(users.id, input.userId));

      return { success: true, message: "Business created successfully" };
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
