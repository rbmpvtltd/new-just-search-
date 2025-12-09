// features/banners/banners.admin.routes.ts
import { db } from "@repo/db";
import { users } from "@repo/db/dist/schema/auth.schema";
import {
  businessCategories,
  businessInsertSchema,
  businessListings,
  businessPhotos,
  businessSubcategories,
  businessUpdateSchema,
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
      const getBusinessCategories = await db.query.categories.findMany({
        where: (categories, { eq }) => eq(categories.type, 1),
      });

      const getStates = await db.query.states.findMany();
      const business = await db.query.businessListings.findFirst({
        where: (business, { eq }) => eq(business.id, input.id),
      });
      const category = await db.query.businessCategories.findFirst({
        where: (businessCategories, { eq }) =>
          eq(businessCategories.businessId, input.id),
        columns: {
          categoryId: true,
        },
      });

      const subcategories = await db.query.businessSubcategories.findMany({
        where: (businessSubcategories, { eq }) =>
          eq(businessSubcategories.businessId, input.id),
        columns: {
          subcategoryId: true,
        },
      });
      const businessPhotos = await db.query.businessPhotos.findMany({
        where: (businessPhotos, { eq }) =>
          eq(businessPhotos.businessId, input.id),
        columns: {
          photo: true,
        },
      });
      return {
        business,
        category,
        businessPhotos,
        subcategories,
        getBusinessCategories,
        getStates,
      };
    }),
  update: adminProcedure
    .input(businessUpdateSchema)
    .mutation(async ({ input }) => {
      const isBusinessExists = await db.query.businessListings.findFirst({
        where: (businessListings, { eq }) =>
          eq(businessListings.userId, Number(input.userId)),
        with: {
          businessPhotos: true,
        },
      });

      if (!isBusinessExists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Business listing not found",
        });
      }

      await cloudinaryDeleteImageByPublicId(isBusinessExists?.photo ?? "");

      const updateBusiness = await db
        .update(businessListings)
        .set({
          name: input.name,
          photo: input.photo,
          specialities: input.specialities,
          description: input.description,
          homeDelivery: input.homeDelivery,
          latitude: input.latitude,
          longitude: input.longitude,
          buildingName: input.buildingName,
          streetName: input.streetName,
          area: input.area,
          landmark: input.landmark,
          pincode: input.pincode,
          state: input.state,
          city: Number(input.city),
          // schedules: input.schedules,
          days: input.days,
          fromHour: input.fromHour,
          toHour: input.toHour,
          email: input.email,
          phoneNumber: input.phoneNumber,
          whatsappNo: input.whatsappNo,
          contactPerson: input.contactPerson,
          ownerNumber: input.ownerNumber,
          alternativeMobileNumber: input.alternativeMobileNumber,
        })
        .where(eq(businessListings.userId, isBusinessExists.userId));
      if (!updateBusiness) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }

      if (isBusinessExists?.businessPhotos.length > 0) {
        const publicIds = isBusinessExists.businessPhotos
          .map((photo) => photo.photo)
          .filter((id): id is string => Boolean(id));

        if (publicIds.length > 0) {
          await cloudinaryDeleteImagesByPublicIds(publicIds);
        }
      }

      await db
        .delete(businessPhotos)
        .where(eq(businessPhotos.businessId, isBusinessExists.id));

      await db
        .delete(businessSubcategories)
        .where(eq(businessSubcategories.businessId, isBusinessExists.id));

      const allPhotos = [
        input.image1,
        input.image2,
        input.image3,
        input.image4,
        input.image5,
      ].filter(Boolean);

      if (allPhotos.length > 0) {
        await db.insert(businessPhotos).values(
          allPhotos.map((photo) => ({
            businessId: isBusinessExists.id,
            photo,
          })),
        );
      }

      await db.insert(businessSubcategories).values(
        input.subcategoryId.map((subCategoryId) => ({
          subcategoryId: subCategoryId,
          businessId: isBusinessExists.id,
        })),
      );
      return {
        success: true,
        message: "Business listing updated successfully",
      };
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
