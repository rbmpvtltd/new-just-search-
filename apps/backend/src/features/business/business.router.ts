import { db, schemas } from "@repo/db";
import { users } from "@repo/db/dist/schema/auth.schema";
import {
  businessInsertSchema,
  businessListings,
  businessPhotos,
  businessReviews,
  businessSubcategories,
  businessUpdateSchema,
  favourites,
  insertBusinessReviewSchema,
} from "@repo/db/dist/schema/business.schema";
import {
  categories,
  subcategories,
} from "@repo/db/dist/schema/not-related.schema";
import {
  offerPhotos,
  offerReviews,
  offers,
} from "@repo/db/dist/schema/offer.schema";
import {
  productPhotos,
  productReviews,
  products,
} from "@repo/db/dist/schema/product.schema";
import { logger } from "@repo/logger";
import { TRPCError } from "@trpc/server";
import { algoliasearch } from "algoliasearch";
import { and, eq, sql } from "drizzle-orm";
import z, { object } from "zod";
import {
  cloudinaryDeleteImageByPublicId,
  cloudinaryDeleteImagesByPublicIds,
} from "@/lib/cloudinary";
import { slugify } from "@/lib/slugify";
import {
  businessProcedure,
  guestProcedure,
  protectedProcedure,
  publicProcedure,
  router,
  visitorProcedure,
} from "@/utils/trpc";
import { changeRoleInSession } from "../auth/lib/session";
import {
  businessApproved,
  createReview,
  reviewExist,
} from "./business.service";

const businessListing = schemas.business.businessListings;
const business_reviews = schemas.business.businessReviews;

const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_API_KEY!,
);
export const businessrouter = router({
  test: protectedProcedure.input(z.object({})).mutation(async ({ ctx }) => {
    const role = await changeRoleInSession(ctx.sessionId, "business");
    return { success: true, message: "Role changed successfully", role };
  }),
  add: visitorProcedure.query(async () => {
    const getBusinessCategories = await db.query.categories.findMany({
      where: (categories, { eq }) => eq(categories.type, 1),
    });
    const getStates = await db.query.states.findMany();
    const getSalesman = await db.query.salesmen.findMany({
      columns: {
        id: true,
        referCode: true,
      },
    });
    return {
      getStates,
      getSalesman,
      getBusinessCategories,
    };
  }),

  getSubCategories: visitorProcedure
    .input(z.object({ categoryId: z.number() }))
    .query(async ({ input }) => {
      const businessSubCategories = await db.query.subcategories.findMany({
        where: (subcategories, { eq }) =>
          eq(subcategories.categoryId, input.categoryId),
        columns: {
          id: true,
          name: true,
        },
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

  create: visitorProcedure
    .input(
      businessInsertSchema.omit({
        userId: true,
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

      // const existingHire = await db.query.hireListing.findFirst({
      //   where: (hireListing, { eq }) => eq(hireListing.userId, ctx.userId),
      // });

      // if (existingHire) {
      //   throw new TRPCError({
      //     code: "CONFLICT",
      //     message: "User already have hire listing",
      //   });
      // }

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

      const slugifyName = slugify(input.name);
      const [createBusiness] = await db
        .insert(schemas.business.businessListings)
        .values({
          userId: ctx.userId,
          salesmanId: input.salesmanId,
          name: input.name,
          slug: slugifyName,
          photo: input.photo,
          specialities: input.specialities,
          description: input.description,
          homeDelivery: input.homeDelivery,
          latitude: input.latitude,
          longitude: input.longitude,
          buildingName: input.buildingName,
          streetName: input.streetName,
          address: input.address,
          landmark: input.landmark,
          pincode: input.pincode,
          state: input.state,
          city: Number(input.city),
          days: input.days,
          fromHour: input.fromHour,
          toHour: input.toHour,
          // schedules: input.schedules,
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
        await db.insert(schemas.business.businessPhotos).values(
          allPhotos.map((photo) => ({
            businessId: businessId,
            photo,
          })),
        );
      }

      const role = await db
        .update(users)
        .set({
          role: "business",
        })
        .where(eq(users.id, ctx.userId));

      await changeRoleInSession(ctx.sessionId, "business");
      const myPlan = await db.query.planUserActive.findFirst({
        where: (planUserActive, { eq }) =>
          eq(planUserActive.userId, ctx.userId),
      });

      if (myPlan) {
        const plan = await db.query.plans.findFirst({
          where: (plans, { eq }) => eq(plans.id, myPlan.planId),
        });

        if (plan?.role === "business") {
          await businessApproved(createBusiness.id);
        }
      }

      return { success: true, message: "Business created successfully" };
    }),

  edit: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const getBusinessCategories = await db.query.categories.findMany({
        where: (categories, { eq }) => eq(categories.type, 1),
        columns: {
          title: true,
          id: true,
        },
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

      const referCode = await db.query.salesmen.findFirst({
        where: (salesmen, { eq }) =>
          eq(salesmen.id, Number(business?.salesmanId)),
        columns: {
          id: true,
          referCode: true,
        },
      });

      return {
        business,
        category,
        referCode,
        getStates,
        subcategories,
        businessPhotos,
        getBusinessCategories,
      };
    }),

  update: businessProcedure
    .input(businessUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      logger.info("ctx.userId", { input: input });
      const isBusinessExists = await db.query.businessListings.findFirst({
        where: (businessListings, { eq }) =>
          eq(businessListings.userId, ctx.userId),
        with: {
          businessPhotos: true,
        },
      });

      logger.info("INPUT", { input: input });
      if (!isBusinessExists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Business listing not found",
        });
      }

      await cloudinaryDeleteImageByPublicId(isBusinessExists?.photo ?? "");

      const updateBusiness = await db
        .update(schemas.business.businessListings)
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
          address: input.address,
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
        .where(
          eq(schemas.business.businessListings.userId, isBusinessExists.userId),
        );
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
        .delete(schemas.business.businessPhotos)
        .where(
          eq(schemas.business.businessPhotos.businessId, isBusinessExists.id),
        );

      await db
        .delete(schemas.business.businessSubcategories)
        .where(
          eq(
            schemas.business.businessSubcategories.businessId,
            isBusinessExists.id,
          ),
        );

      const allPhotos = [
        input.image1,
        input.image2,
        input.image3,
        input.image4,
        input.image5,
      ].filter(Boolean);

      if (allPhotos.length > 0) {
        await db.insert(schemas.business.businessPhotos).values(
          allPhotos.map((photo) => ({
            businessId: isBusinessExists.id,
            photo,
          })),
        );
      }

      await db.insert(schemas.business.businessSubcategories).values(
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

  show: businessProcedure.query(async ({ ctx }) => {
    console.log("Business Show", ctx);
    logger.info("Business Show", { ctx });
    if (!ctx.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not logged in",
      });
    }

    const business = await db.query.businessListings.findFirst({
      where: (businessListings, { eq }) =>
        eq(businessListings.userId, ctx.userId),
      with: {
        businessPhotos: true,
      },
      columns: {
        id: true,
        name: true,
        city: true,
        photo: true,
        state: true,
        status: true,
        address: true,
        landmark: true,
        streetName: true,
        buildingName: true,
      },
    });

    if (!business) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Business not found",
      });
    }

    const city = (
      await db.query.cities.findFirst({
        where: (cities, { eq }) => eq(cities.id, business.city),
        columns: {
          city: true,
        },
      })
    )?.city;

    const state = (
      await db.query.states.findFirst({
        where: (states, { eq }) => eq(states.id, business.state),
        columns: {
          name: true,
        },
      })
    )?.name;

    const isVerified = (
      await db.query.planUserActive.findFirst({
        where: (planUserActive, { eq }) =>
          eq(planUserActive.userId, ctx.userId),
        columns: {
          features: true,
        },
      })
    )?.features.verifyBag;
    return {
      ...business,
      isVerified: isVerified,
      city: city,
      state: state,
      success: true,
    };
  }),

  delete: businessProcedure.mutation(async ({ ctx }) => {
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
    await db
      .delete(schemas.business.businessSubcategories)
      .where(
        eq(schemas.business.businessSubcategories.businessId, business.id),
      );
    await db
      .delete(schemas.business.businessCategories)
      .where(eq(schemas.business.businessCategories.businessId, business.id));

    await db
      .delete(schemas.business.businessListings)
      .where(eq(schemas.business.businessListings.userId, Number(ctx.userId)));
    await db
      .update(schemas.auth.users)
      .set({
        role: "visiter",
      })
      .where(eq(schemas.auth.users.id, ctx.userId));

    changeRoleInSession(ctx.sessionId, "visiter");

    return {
      success: true,
      message: "Business listing deleted successfully",
    };
  }),

  singleShop: guestProcedure
    .input(z.object({ businessId: z.number() }))
    .query(async ({ input, ctx }) => {
      console.log("-----hiii----");

      if (ctx.userId) {
        const shopWithFavourites = await db
          .select({
            id: businessListing.id,
            userId: businessListing.userId,
            name: businessListing.name,
            email: businessListing.email,
            photo: businessListing.photo,
            phoneNumber: businessListing.phoneNumber,
            pincode: businessListing.pincode,
            homeDelivery: businessListing.homeDelivery,
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
            rating: sql<
              {
                id: number;
                created_at: string;
                rating: number;
                message: string;
                user: string;
              }[]
            >`COALESCE(
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
            isFavourite: sql<boolean>`CASE WHEN ${favourites.id} IS NOT NULL THEN true ELSE false END`,
          })
          .from(businessListing)
          .leftJoin(
            businessSubcategories,
            eq(businessListing.id, businessSubcategories.businessId),
          )
          .leftJoin(
            subcategories,
            eq(
              schemas.business.businessSubcategories.subcategoryId,
              subcategories.id,
            ),
          )
          .leftJoin(categories, eq(subcategories.categoryId, categories.id))
          .leftJoin(
            businessPhotos,
            eq(businessListing.id, businessPhotos.businessId),
          )
          .leftJoin(
            business_reviews,
            eq(businessListing.id, business_reviews.businessId),
          )
          .leftJoin(
            favourites,
            and(
              eq(favourites.businessId, businessListing.id),
              eq(favourites.userId, ctx.userId),
            ),
          )
          .leftJoin(users, eq(business_reviews.userId, users.id))
          .groupBy(businessListing.id, ...(ctx.userId ? [favourites.id] : []))
          .where(eq(businessListing.id, input.businessId));

        return shopWithFavourites[0];
      } else {
        const shopWithFavourites = await db
          .select({
            id: businessListing.id,
            userId: businessListing.userId,
            name: businessListing.name,
            email: businessListing.email,
            photo: businessListing.photo,
            phoneNumber: businessListing.phoneNumber,
            pincode: businessListing.pincode,
            homeDelivery: businessListing.homeDelivery,
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
            rating: sql<
              {
                id: number;
                created_at: string;
                rating: number;
                message: string;
                user: string;
              }[]
            >`COALESCE(
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
            isFavourite: sql<boolean>`false`,
          })
          .from(businessListing)
          .leftJoin(
            businessSubcategories,
            eq(businessListing.id, businessSubcategories.businessId),
          )
          .leftJoin(
            subcategories,
            eq(
              schemas.business.businessSubcategories.subcategoryId,
              subcategories.id,
            ),
          )
          .leftJoin(categories, eq(subcategories.categoryId, categories.id))
          .leftJoin(
            businessPhotos,
            eq(businessListing.id, businessPhotos.businessId),
          )
          .leftJoin(
            business_reviews,
            eq(businessListing.id, business_reviews.businessId),
          )

          .leftJoin(users, eq(business_reviews.userId, users.id))
          .groupBy(businessListing.id)
          .where(eq(businessListing.id, input.businessId));

        return shopWithFavourites[0];
      }
    }),

  shopOffers: publicProcedure
    .input(z.object({ businessId: z.number() }))
    .query(async ({ input }) => {
      const offersData = await db
        .select({
          id: offers.id,
          price: offers.rate,
          discountPercent: offers.discountPercent,
          finalPrice: offers.finalPrice,
          name: offers.offerName,
          photos: sql<string[]>`
          COALESCE(
            (SELECT ARRAY_AGG(offer_photos.photo)
             FROM offer_photos
             WHERE offer_photos.offer_id = offers.id),
            '{}'
          )
        `,
        })
        .from(offers)
        .where(eq(offers.businessId, input.businessId));

      return offersData;
    }),

  shopProducts: publicProcedure
    .input(z.object({ businessId: z.number() }))
    .query(async ({ input }) => {
      const productsData = await db
        .select({
          id: products.id,
          name: products.productName,
          price: products.rate,
          photos: sql<string[]>`
          COALESCE(
            (SELECT ARRAY_AGG(product_photos.photo)
             FROM product_photos
             WHERE product_photos.product_id = products.id),
            '{}'
          )
        `,
        })
        .from(products)
        .where(eq(products.businessId, input.businessId));

      return productsData;
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
          latitude: businessListing.latitude,
          userId: businessListing.userId,
          longitude: businessListing.longitude,
          phone: businessListing.phoneNumber,
          photos: sql<string[]>`COALESCE(
            ARRAY_AGG(DISTINCT product_photos.photo)
            FILTER (WHERE product_photos.id IS NOT NULL),
            '{}'
          )`,
          shopName: sql<string | null>`COALESCE((
              SELECT name FROM business_listings LIMIT 1
          ), '')`,
          rating: sql<
            {
              id: number;
              created_at: string;
              rating: number;
              message: string;
              user: string;
            }[]
          >`COALESCE(
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
        .groupBy(
          products.id,
          businessListing.latitude,
          businessListing.longitude,
          businessListing.phoneNumber,
          businessListing.userId,
        )
        .where(eq(products.id, input.productId));
      return product[0];
    }),

  singleOffer: publicProcedure
    .input(z.object({ offerId: z.number() }))
    .query(async ({ input }) => {
      const offer = await db
        .select({
          id: offers.id,
          name: offers.offerName,
          rate: offers.rate,
          discountPercent: offers.discountPercent,
          finalPrice: offers.finalPrice,
          startDate: offers.offerStartDate,
          endDate: offers.offerEndDate,
          description: offers.offerDescription,
          userId: businessListing.userId,
          createdAt: offers.createdAt,
          businessId: offers.businessId,
          phoneNo: businessListing.phoneNumber,
          shopName: sql<string | null>`COALESCE((
            SELECT name FROM business_listings LIMIT 1
          ), '')`,
          photos: sql<string[]>`COALESCE(
            ARRAY_AGG(DISTINCT offer_photos.photo)
            FILTER (WHERE offer_photos.id IS NOT NULL),
            '{}'
          )`,
          rating: sql<
            {
              id: number;
              created_at: string;
              rating: number;
              message: string;
              user: string;
            }[]
          >`COALESCE(
          JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
              'id', offer_reviews.id,
              'created_at', offer_reviews.created_at,
              'rating', offer_reviews.rate,
              'message', offer_reviews.message,
              'user', users.display_name
            )
          ) FILTER (WHERE offer_reviews.id IS NOT NULL),
          '[]'
        )`,
        })
        .from(offers)
        .leftJoin(offerPhotos, eq(offerPhotos.offerId, offers.id))
        .leftJoin(offerReviews, eq(offers.id, offerReviews.offerId))
        .leftJoin(users, eq(users.id, offerReviews.userId))
        .leftJoin(businessListing, eq(businessListing.id, offers.businessId))
        .groupBy(offers.id, businessListing.phoneNumber, businessListing.userId)
        .where(eq(offers.id, input.offerId));

      return offer[0];
    }),

  toggleFavourite: visitorProcedure
    .input(z.object({ businessId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      const businessId = input.businessId;

      if (!userId) {
        throw new Error("User not authenticated");
      }

      const existing = await db
        .select({ id: favourites.id })
        .from(favourites)
        .where(
          and(
            eq(favourites.userId, userId),
            eq(favourites.businessId, businessId),
          ),
        );

      if (existing.length > 0) {
        await db
          .delete(favourites)
          .where(
            and(
              eq(favourites.userId, userId),
              eq(favourites.businessId, businessId),
            ),
          );

        return { status: "removed" };
      } else {
        await db.insert(favourites).values({
          userId,
          businessId,
        });

        return { status: "added", success: true };
      }
    }),
  favouritesShops: protectedProcedure.query(async ({ ctx }) => {
    // TODO : add pagination after complete some work
    const data = await db
      .select({
        id: favourites.id,
        shop: sql<
          {
            id: number;
            name: string;
            photo: string | null;
            latitude: number | null;
            longitude: number | null;
            phoneNumber: string | null;
            area: string | null;
            streetName: string | null;
            buildingName: string | null;
          }[]
        >`COALESCE(
          JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
            'id', business_listings.id,
            'name', business_listings.name,
            'photo', business_listings.photo,
            'latitude', business_listings.latitude,
            'longitude', business_listings.longitude,
            'phoneNumber', business_listings.phone_number,
            'area', business_listings.area,
            'streetName', business_listings.street_name,
            'buildingName', business_listings.building_name
          ))
          FILTER (WHERE business_listings.id IS NOT NULL),
          '[]'
        )`,
        rating: sql<string>`COALESCE(AVG(${schemas.business.businessReviews.rate}),0)`,
        subcategories: sql<string[]>`
          COALESCE(
            ARRAY_AGG(DISTINCT subcategories.name) 
            FILTER (WHERE subcategories.id IS NOT NULL),
            '{}'
          )
        `,
        category: sql<string | null>`MAX(${categories.title})`,
      })
      .from(favourites)
      .leftJoin(
        businessSubcategories,
        eq(favourites.businessId, businessSubcategories.businessId),
      )
      .leftJoin(
        subcategories,
        eq(
          schemas.business.businessSubcategories.subcategoryId,
          subcategories.id,
        ),
      )
      .leftJoin(
        businessReviews,
        eq(favourites.businessId, businessReviews.businessId),
      )
      .leftJoin(categories, eq(subcategories.categoryId, categories.id))
      .leftJoin(
        businessListings,
        eq(favourites.businessId, businessListings.id),
      )
      .groupBy(favourites.id)
      .where(eq(favourites.userId, ctx.userId));

    return {
      data: data,
      success: true,
      ctx: { userId: ctx.userId },
    };
  }),
  businessReview: protectedProcedure
    .input(insertBusinessReviewSchema)
    .mutation(async ({ input, ctx }) => {
      const { businessId, message, rate } = input;
      const { userId } = ctx;

      const isReviewExist = await reviewExist(businessId, userId);
      console.log("review exist status is==>", isReviewExist);
      if (isReviewExist) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You've already submitted review on that business",
        });
      }
      await createReview(userId, businessId, rate ?? 0, message ?? "");

      return { success: true, message: "Review Has Been Submitted" };
    }),
  ReviewSubmitted: protectedProcedure
    .input(z.object({ businessId: z.number() }))
    .query(async ({ input, ctx }) => {
      const { businessId } = input;
      const { userId } = ctx;
      const isSubmitted = await reviewExist(businessId, userId);
      return { submitted: isSubmitted };
    }),
});
