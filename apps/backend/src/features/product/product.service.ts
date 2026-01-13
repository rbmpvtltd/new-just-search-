import { db, schemas } from "@repo/db";
import { users } from "@repo/db/dist/schema/auth.schema";
import {
  businessCategories,
  businessListings,
} from "@repo/db/dist/schema/business.schema";
import { productReviews, products } from "@repo/db/dist/schema/product.schema";
import { TRPCError } from "@trpc/server";
import { algoliasearch } from "algoliasearch";
import { and, eq, sql } from "drizzle-orm";

const businessListing = schemas.business.businessListings;
const business_reviews = schemas.business.businessReviews;
const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_API_KEY!,
);
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
      address: businessListing.address,
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

async function productReviewExist(
  userId: number,
  productId: number,
  email?: string,
) {
  if (email) {
    const data = await db
      .select()
      .from(productReviews)
      .where(
        and(
          eq(productReviews.email, email),
          eq(productReviews.userId, userId),
          eq(productReviews.productId, productId),
        ),
      );

    return data.length > 0;
  }
  const data = await db
    .select()
    .from(productReviews)
    .where(
      and(
        eq(productReviews.userId, userId),
        eq(productReviews.productId, productId),
      ),
    );

  return data.length > 0;
}

async function createProductReview(
  userId: number,
  productId: number,
  businessId: number,
  rating: number,
  message: string,
  name: string,
  email: string,
  status: boolean,
) {
  try {
    const data = db
      .insert(productReviews)
      .values({
        userId: userId,
        productId: productId,
        businessId: businessId,
        name: name,
        rate: rating,
        email: email,
        message: message,
        status: status,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return data;
  } catch (err) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Could Not Create Review",
    });
  }
}

async function productApproved(productId: number) {
  const product = (
    await db
      .select({
        id: products.id,
        name: products.productName,
        discountPercent: products.discountPercent,
        businessId: products.businessId,
        finalPrice: products.finalPrice,
        price: products.rate,
        photos: sql<string[]>`
      COALESCE(
        (SELECT ARRAY_AGG(product_photos.photo)
         FROM product_photos
         WHERE product_photos.product_id = products.id),
        '{}'
      )
    `,
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
      .from(products)
      .leftJoin(
        schemas.product.productSubCategories,
        eq(products.id, schemas.product.productSubCategories.productId),
      )
      .leftJoin(
        schemas.not_related.subcategories,
        eq(
          schemas.product.productSubCategories.subcategoryId,
          schemas.not_related.subcategories.id,
        ),
      )
      .leftJoin(businessListings, eq(products.businessId, businessListings.id))
      .leftJoin(
        businessCategories,
        eq(businessListings.id, businessCategories.businessId),
      )
      .leftJoin(
        schemas.not_related.categories,
        eq(businessCategories.categoryId, schemas.not_related.categories.id),
      )
      .groupBy(products.id)
      .where(eq(products.id, productId))
  )[0];

  await algoliaClient.saveObjects({
    indexName: "product_offer_listing",
    objects: [
      {
        objectID: `products:${productId}`,
        navigationId: product?.id,
        name: product?.name,
        photo: product?.photos,
        businessId: product?.businessId,
        price: product?.price,
        discountPercent: product?.discountPercent ?? 0,
        finalPrice: product?.finalPrice ?? 0,
        subecategory: product?.subcategories,
        category: product?.category,
      },
    ],
  });
}

export { singleShop, productReviewExist, createProductReview, productApproved };
