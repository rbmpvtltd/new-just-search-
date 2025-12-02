import { db, schemas } from "@repo/db";
import { users } from "@repo/db/dist/schema/auth.schema";
import { businessReviews } from "@repo/db/dist/schema/business.schema";
import { TRPCError } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";
import { boolean } from "zod";

const businessListing = schemas.business.businessListings;
const business_reviews = schemas.business.businessReviews;

async function singleShop(shopId: number) {
  const singleShopData = await db
    .select({
      id: businessListing.id,
      userId: businessListing.userId,
      name: businessListing.name,
      email: businessListing.email,
      photo: businessListing.photo,
      phoneNumber: businessListing.phoneNumber,
      pincode: businessListing.pincode,
      homeDelivery: businessListing.homeDelivery,
      // schedule: businessListing.schedules,
      status: businessListing.status,
      area: businessListing.area,
      streetName: businessListing.streetName,
      buildingName: businessListing.buildingName,
      createdAt: businessListing.createdAt,
      latitude: businessListing.latitude,
      longitude: businessListing.longitude,
      landMark: businessListing.landmark,
      whatsappNo: businessListing.whatsappNo,
      description: businessListing.description,
      updatedAt: businessListing.updatedAt,
      specialities: businessListing.specialities,
      rating: sql<string[]>`COALESCE(
                JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
                  'id', business_reviews.id,
                  'created_at', business_reviews.created_at,
                  'rating', business_reviews.rate,
                  'message', business_reviews.message,
                  'user', users.display_name
                ))
                  FILTER (WHERE business_reviews.id IS NOT NULL),
                '[]'
              )`,

      offers: sql<any[]>`
              COALESCE(
                JSON_AGG(
                  DISTINCT JSONB_BUILD_OBJECT(
                    'id', offers.id,
                    'price', offers.rate,
                    'discountPercent' , offers.discount_percent,
                    'final_price', offers.final_price,
                    'name', offers.product_name,
                    'photos', COALESCE((
                      SELECT ARRAY_AGG(DISTINCT offer_photos.photo)
                      FROM offer_photos
                      WHERE offer_photos."offer_id" = offers.id
                    ), '{}')
                  )
                ) FILTER (WHERE offers.id IS NOT NULL),
                '[]'
              )
            `,
      products: sql<any[]>`
                COALESCE(
                  JSON_AGG(
                    DISTINCT JSONB_BUILD_OBJECT(
                      'id', products.id,
                      'price', products.rate,
                      'name', products.product_name,
                      'photos', COALESCE((
                        SELECT ARRAY_AGG(DISTINCT product_photos.photo)
                        FROM product_photos
                        WHERE product_photos."product_id" = products.id
                      ), '{}')
                    )
                  ) FILTER (WHERE products.id IS NOT NULL),
                  '[]'
                )
              `,
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
      businessPhotos: sql<string[]>`
              COALESCE(
                ARRAY_AGG(DISTINCT business_photos.photo)
                FILTER (WHERE business_photos.id IS NOT NULL),
                '{}'
              )
            `,
    })
    .from(businessListing)
    .leftJoin(
      schemas.business.businessSubcategories,
      eq(businessListing.id, schemas.business.businessSubcategories.businessId),
    )
    .leftJoin(
      schemas.product.products,
      eq(businessListing.id, schemas.product.products.businessId),
    )
    .leftJoin(
      schemas.offer.offers,
      eq(businessListing.id, schemas.offer.offers.businessId),
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
    // .leftJoin(
    //   business_reviews,
    //   eq(businessListing.id, business_reviews.businessId),
    // )
    .leftJoin(
      schemas.business.businessPhotos,
      eq(businessListing.id, schemas.business.businessPhotos.businessId),
    )
    .leftJoin(
      business_reviews,
      eq(businessListing.id, business_reviews.businessId),
    )
    .leftJoin(users, eq(business_reviews.userId, users.id))
    .groupBy(businessListing.id)
    .where(eq(businessListing.id, shopId));

  return singleShopData;
}

async function reviewExist(
  businessId: number,
  userId: number,
): Promise<boolean> {
  // find review based on userId and businessId
  const data = await db
    .select()
    .from(businessReviews)
    .where(
      and(
        eq(businessReviews.userId, userId),
        eq(businessReviews.businessId, businessId),
      ),
    );

  // return true if reviwe already exist
  if (data.length > 0) {
    return true;
  }
  // return if review is not exist
  return false;
}

async function createReview(
  userId: number,
  businessId: number,
  rate: number,
  message: string,
) {
  try {
    console.log("execution comes here===>", userId, businessId, rate, message);
    const data = await db
      .insert(businessReviews)
      .values({
        businessId,
        userId,
        rate,
        message,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
    console.log("review created successfully",data);
    return data;
  } catch (err: any) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Could Not Create Review",
      cause: err,
    });
  }
}

export { singleShop, reviewExist, createReview };
