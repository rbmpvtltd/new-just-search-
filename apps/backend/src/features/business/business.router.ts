import { db, schemas } from "@repo/db";
import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import z from "zod";
import {
  businessProcedure,
  publicProcedure,
  router,
  visitorProcedure,
} from "@/utils/trpc";
import { changeRoleInSession } from "../auth/lib/session";
import { users } from "../../../../../packages/db/src/schema/auth.schema";
import {
  productPhotos,
  productReviews,
  products,
} from "../../../../../packages/db/src/schema/product.schema";
import { offerPhotos, offers } from "../../../../../packages/db/src/schema/offer.schema";

const businessListing = schemas.business.businessListings;
const business_reviews = schemas.business.businessReviews;

export const businessrouter = router({
  add: businessProcedure.query(async ({ ctx }) => {
    const getBusinessCategories = await db.query.businessCategories.findMany();
    const getBusinessSubCategories =
      await db.query.businessSubcategories.findMany();
    const getStates = await db.query.states.findMany();
    const getCities = await db.query.cities.findMany();

    return {
      getBusinessCategories,
      getBusinessSubCategories,
      getStates,
      getCities,
    };
    // const user = await db.query.users.findFirst({
    //   where: (user, { eq }) => eq(user.id, ctx.userId),
    // });
    // return user;
  }),

  create: visitorProcedure
    .input(
      z.object({
        name: z.string(),
        slug: z.string(),
        photo: z.string(),
        categoryId: z.number(),
        subcategoryId: z.array(z.number()),
        specialities: z.string(),
        description: z.string(),
        homeDelivery: z.boolean(),
        shopImages: z.array(z.string()),
        latitude: z.string(),
        longitude: z.string(),
        buildingName: z.string(),
        streetName: z.string(),
        area: z.string(),
        landmark: z.string(),
        pincode: z.number(),
        cityId: z.number(),
        stateId: z.number(),
        schedules: z.array(
          z.object({
            days: z.array(z.string()),
            openingTime: z.string(),
            openingTimePeriod: z.string(),
            closingTime: z.string(),
            closingTimePeriod: z.string(),
          }),
        ),
        phoneNumber: z.string(),
        email: z.string(),
        contactPerson: z.string(),
        ownerNumber: z.string(),
        whatsappNo: z.string(),
        alternativeMobileNumber: z.string(),
        facebook: z.string(),
        twitter: z.string(),
        linkedin: z.string(),
        listingVideo: z.string(),
        isFeature: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, ctx.userId),
      });
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });
      }

      // const existingHire = await db.query.hireListings.findFirst({
      //   where: (hireListings, { eq }) => eq(hireListings.userId, ctx.userId),
      // });

      const existingBusiness = await db.query.businessListings.findFirst({
        where: (businessListings, { eq }) =>
          eq(businessListings.userId, ctx.userId),
      });

      if (existingBusiness) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Business already exist",
        });
      }

      const existingEmail = await db.query.businessListings.findFirst({
        where: (businessListings, { eq }) =>
          eq(businessListings.email, input.email),
      });

      if (existingEmail) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email address already exist",
        });
      }

      const isStateExists = await db.query.states.findFirst({
        where: (states, { eq }) => eq(states.id, input.stateId),
      });
      // return isStateExists;

      if (!isStateExists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "State not found",
        });
      }

      const isCityExists = await db.query.cities.findFirst({
        where: (cities, { eq }) => eq(cities.id, input.cityId),
      });
      if (!isCityExists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "City not found",
        });
      }

      const [createBusiness] = await db
        .insert(schemas.business.businessListings)
        .values({
          userId: ctx.userId,
          name: input.name,
          slug: input.slug,
          photo: input.photo,
          specialities: input.specialities,
          description: input.description,
          homeDelivery: input.homeDelivery === false,
          latitude: input.latitude,
          longitude: input.longitude,
          buildingName: input.buildingName,
          streetName: input.streetName,
          area: input.area,
          landmark: input.landmark,
          pincode: Number(input.pincode),
          cityId: Number(input.cityId),
          schedules: input.schedules,
          email: input.email,
          phoneNumber: input.phoneNumber,
          whatsappNo: input.whatsappNo,
          contactPerson: input.contactPerson,
          ownerNumber: input.ownerNumber,
          alternativeMobileNumber: input.alternativeMobileNumber,
          facebook: input.facebook,
          twitter: input.twitter,
          linkedin: input.linkedin,
          listingVideo: input.listingVideo,
          isFeature: input.isFeature === "true",
        })
        .returning({
          id: schemas.business.businessListings.id,
        });
      if (!createBusiness) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Failed to create business",
        });
      }
      const businessId = createBusiness.id;
      await db.insert(schemas.business.businessCategories).values({
        businessId,
        categoryId: input.categoryId,
      });

      if (input.subcategoryId.length > 0) {
        await db.insert(schemas.business.businessSubcategories).values(
          input.subcategoryId.map((subCategoryId) => ({
            businessId,
            subcategoryId: subCategoryId,
          })),
        );
      }
      await db.insert(schemas.business.businessPhotos).values({
        businessId,
        photo: input.photo,
      });
      await db.insert(schemas.business.businessPhotos).values(
        input.shopImages.map((image) => ({
          businessId,
          photo: image,
        })),
      );
      await db
        .update(schemas.auth.users)
        .set({
          role: "business",
        })
        .where(eq(schemas.auth.users.id, ctx.userId));

      changeRoleInSession(ctx.sessionId, "business");
      return { success: true, message: "Business created successfully" };
    }),

  show: businessProcedure.query(async ({ ctx }) => {
    const business = await db.query.businessListings.findFirst({
      where: (businessListings, { eq }) =>
        eq(businessListings.userId, ctx.userId),
    });

    if (!business) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Business not found",
      });
    }

    return business;
  }),

  singleShop: publicProcedure
    .input(z.object({ businessId: z.number() }))
    .query(async ({ input }) => {
      console.log("execution comes here line number 234");
      const shop = await db
        .select({
          id: businessListing.id,
          userId: businessListing.userId,
          name: businessListing.name,
          email: businessListing.email,
          photo: businessListing.photo,
          phoneNumber: businessListing.phoneNumber,
          pincode: businessListing.pincode,
          homeDelivery: businessListing.homeDelivery,
          schedule: businessListing.schedules,
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
          eq(
            businessListing.id,
            schemas.business.businessSubcategories.businessId,
          ),
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
        .where(eq(businessListing.id, input.businessId));

      console.log("execution comes here line number 317");

      return shop[0];
    }),

  singleProduct: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      const product = await db
        .select({
          id: products.id,
          name: products.productName,
          rate: products.rate,
          businessId: products.businessId,
          description: products.productDescription,
          photos: sql<string[]>`COALESCE(
            ARRAY_AGG(DISTINCT product_photos.photo)
            FILTER (WHERE product_photos.id IS NOT NULL),
            '{}'
          )`,
          shopName: sql<string | null>`COALESCE((
              SELECT name FROM business_listings LIMIT 1
          ), '')`,
          rating: sql<string[]>`COALESCE(
            JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
              'id', product_reviews.id,
              'created_at', product_reviews.created_at,
              'rating', product_reviews.rate,
              'message', product_reviews.message,
              'user', users.display_name
            ))
              FILTER (WHERE product_reviews.id IS NOT NULL),
            '[]'
          )`,
        })
        .from(products)
        .leftJoin(businessListing, eq(businessListing.id, products.businessId))
        .leftJoin(productReviews, eq(products.id, productReviews.productId))
        .leftJoin(productPhotos, eq(products.id, productPhotos.productId))
        .leftJoin(users, eq(productReviews.userId, users.id))
        .groupBy(products.id)
        .where(eq(products.id, input.productId));
      return product[0];
    }),

  singleOffer: publicProcedure
    .input(z.object({ offerId: z.number() }))
    .query(async ({ input }) => {
      const offer = await db
        .select({
          id: offers.id,
          name: offers.productName,
          rate: offers.rate,
          discountPercent : offers.discountPercent,
          finalPrice : offers.finalPrice,
          startDate : offers.offerStartDate,
          endDate : offers.offerEndDate,
          description : offers.productDescription,
          createdAt : offers.createdAt,
          businessId: offers.businessId,
          shopName : sql<string | null>`COALESCE((
            SELECT name FROM business_listings LIMIT 1
          ), '')`,
          photos : sql<string[]>`COALESCE(
            ARRAY_AGG(DISTINCT offer_photos.photo)
            FILTER (WHERE offer_photos.id IS NOT NULL),
            '{}'
          )`
        })
        .from(offers)
        .leftJoin(offerPhotos,eq(offerPhotos.offerId,offers.id))
        .leftJoin(businessListing,eq(businessListing.id,offers.businessId))
        .groupBy(offers.id)
        .where(eq(offers.id, input.offerId));


      return offer[0];
    }),
});
