import { db, schemas } from "@repo/db";
import { logger } from "@repo/helper";
import { eq, sql } from "drizzle-orm";

const banners = schemas.not_related.banners;
const business = schemas.business.businessListings;
const business_reviews = schemas.business.businessReviews;

async function getBannerData(type: number) {
  logger.info("hire2")
  const banner = await db
  .select({ photo: banners.photo, id: banners.id })
  .from(banners)
  .where(eq(banners.type, type));
  
  logger.info("banner is",banner)
  return banner;
}

async function premiumShops() {

  const premiumShops = await db
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
    .leftJoin(business_reviews, eq(business.id, business_reviews.businessId))
    .groupBy(business.id)
    .limit(8);

  return premiumShops;
}

export { getBannerData, premiumShops };
