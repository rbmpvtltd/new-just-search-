import { db, schemas } from "@repo/db";
import { categories } from "@repo/db/src/schema/not-related.schema";
import { logger } from "@repo/helper";
import { and, count, eq, gt, sql } from "drizzle-orm";
import z from "zod";
import { publicProcedure, router } from "@/utils/trpc";

const businessListings = schemas.business.businessListings;
const businessCategories = schemas.business.businessCategories;

export const subcategoryRouter = router({
  subcategory: publicProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        categoryId: z.number(),
        limit: z.number().min(1).max(20).nullish(),
        page: z.number().min(1),
      }),
    )
    .query(async ({ input }) => {
      console.log("execution comes here");
      const limit = input.limit ?? 10;
      const offset = (input.page - 1) * limit;

      const data = await db
        .select({
          id: businessListings.id,
          name: businessListings.name,
          photo: businessListings.photo,
          area: businessListings.area,
          streetName: businessListings.streetName,
          buildingName: businessListings.buildingName,
          longitude: businessListings.longitude,
          latitude: businessListings.latitude,
          phoneNumber: businessListings.phoneNumber,
          rating: sql<
            string[]
          >`COALESCE(AVG(${schemas.business.businessReviews.rate}),0)`,
          subcategories: sql<string[]>`
          COALESCE(
            ARRAY_AGG(DISTINCT subcategories.name) 
            FILTER (WHERE subcategories.id IS NOT NULL),
            '{}'
          )
        `,
          category: sql<string | null>`
      MAX(${schemas.not_related.categories.title})
    `,
        })
        .from(businessListings)
        .innerJoin(
          businessCategories,
          eq(businessListings.id, businessCategories.businessId),
        )
        .leftJoin(
          schemas.business.businessSubcategories,
          eq(
            businessListings.id,
            schemas.business.businessSubcategories.businessId,
          ),
        )
        .leftJoin(
          schemas.not_related.subcategories,
          eq(
            schemas.business.businessSubcategories.subcategoryId,
            schemas.not_related.subcategories.id,
          ),
        )
        .leftJoin(
          schemas.not_related.categories,
          eq(
            schemas.not_related.subcategories.categoryId,
            schemas.not_related.categories.id,
          ),
        )
        .leftJoin(
          schemas.business.businessReviews,
          eq(businessListings.id, schemas.business.businessReviews.businessId),
        )
        .where(eq(businessCategories.categoryId, input.categoryId))
        .groupBy(businessListings.id)
        .limit(limit)
        .offset(offset);
      console.log("execution comes here ===================>", data);

      const totalCount = await db
        .select({ count: count() })
        .from(businessListings)
        .innerJoin(
          businessCategories,
          eq(businessListings.id, businessCategories.businessId),
        )
        .where(eq(businessCategories.categoryId, input.categoryId));

      return {
        data,
        page: input.page,
        totalPages: Math.ceil(Number(totalCount[0]?.count ?? 0) / limit),
      };
    }),
  businessesByCategoryInfinate: publicProcedure
    .input(
      z.object({
        cursor: z.number(),
        categoryId: z.number(),
        limit: z.number().min(1).max(20).nullish(),
      }),
    )
    .query(async ({ input }) => {
      logger.info("execution comes here");
      logger.info("cursor is", { cursor: input.cursor }, { data: "< --this" });
      const limit = input.limit ?? 10;

      const data = await db
      .select({
        id: businessListings.id,
        name: businessListings.name,
        photo: businessListings.photo,
        area: businessListings.area,
        streetName: businessListings.streetName,
        buildingName: businessListings.buildingName,
        longitude: businessListings.longitude,
        latitude: businessListings.latitude,
        phoneNumber: businessListings.phoneNumber,
        rating: sql<
          string[]
        >`COALESCE(AVG(${schemas.business.businessReviews.rate}),0)`,
        subcategories: sql<string[]>`
        COALESCE(
          ARRAY_AGG(DISTINCT subcategories.name) 
          FILTER (WHERE subcategories.id IS NOT NULL),
          '{}'
        )
      `,
        category: sql<string | null>`
    MAX(${schemas.not_related.categories.title})
  `,
      })
      .from(businessListings)
      .innerJoin(
        businessCategories,
        eq(businessListings.id, businessCategories.businessId),
      )
      .leftJoin(
        schemas.business.businessSubcategories,
        eq(
          businessListings.id,
          schemas.business.businessSubcategories.businessId,
        ),
      )
      .leftJoin(
        schemas.not_related.subcategories,
        eq(
          schemas.business.businessSubcategories.subcategoryId,
          schemas.not_related.subcategories.id,
        ),
      )
      .leftJoin(
        schemas.not_related.categories,
        eq(
          schemas.not_related.subcategories.categoryId,
          schemas.not_related.categories.id,
        ),
      )
      .leftJoin(
        schemas.business.businessReviews,
        eq(businessListings.id, schemas.business.businessReviews.businessId),
      )
      .where(
        and(
          gt(businessListings.id, input.cursor),
          eq(businessCategories.categoryId, input.categoryId)
        )
      )
      .groupBy(businessListings.id)
      .limit(limit)

      
      const nextCursor = data[data.length - 1]?.id;
      
      console.log("data is ====================>",data.length)
      console.log("cursor is ====================>",nextCursor)

      return {
        data,
        nextCursor,
      };
    }),
});
