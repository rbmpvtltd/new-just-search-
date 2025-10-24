import z from "zod";
import { publicProcedure, router, visitorProcedure } from "@/utils/trpc";
import { getBannerData } from "./banners.service";
import { db, schemas } from "@repo/db";
import { and, eq, sql } from "drizzle-orm";
import { favourites } from "@repo/db/src/schema/business.schema";

const business = schemas.business.businessListings;
const business_reviews = schemas.business.businessReviews;

export const bannerRouter = router({
  getBannerData: publicProcedure
    .input(z.object({ type: z.number() }))
    .query(async ({ input }) => {
      const data = getBannerData(input.type);
      console.log("caraousel data in backend===============>",data)
      return data;
    }),

  premiumShops: visitorProcedure.query(async ({ctx}) => {
    const data = await db
      .select({
        photo: business.photo,
        id: business.id,
        name: business.name,
        area: business.area,
        streetName: business.streetName,
        buildingName: business.buildingName,
        rating: sql<string[]>`COALESCE(AVG(${business_reviews.rate}),0)`,
        subcategories: sql<string[]>`
          COALESCE(
            ARRAY_AGG(DISTINCT subcategories.name) 
            FILTER (WHERE subcategories.id IS NOT NULL),
            '{}'
          )
        `,
        category: sql<
          string | null
        >`MAX(${schemas.not_related.categories.title})`,
        isFavourite: sql<boolean>`CASE WHEN ${favourites.id} IS NOT NULL THEN true ELSE false END`,
      })
      .from(business)
      .leftJoin(
        schemas.business.businessSubcategories,
        eq(business.id, schemas.business.businessSubcategories.businessId),
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
        favourites,
        and(
          eq(favourites.businessId, business.id),
          eq(favourites.userId, ctx.userId)
        )
      )
      .leftJoin(business_reviews, eq(business.id, business_reviews.businessId))
      .groupBy(business.id,favourites.id)
      .limit(8);
    return data;
  }),
});
