import { db, schemas } from "@repo/db";
import { users } from "@repo/db/src/schema/auth.schema";
import {
  businessInsertSchema,
  businessUpdateSchema,
  businessListings,
  businessPhotos,
  businessReviews,
  businessSubcategories,
  favourites,
} from "@repo/db/src/schema/business.schema";
import {
  offerPhotos,
  offers,
  offersInsertSchema,
} from "@repo/db/src/schema/offer.schema";
import {
  productInsertSchema,
  productPhotos,
  productReviews,
  products,
} from "@repo/db/src/schema/product.schema";
import { logger } from "@repo/helper";
import { TRPCError } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";
import slugify from "slugify";
import z from "zod";
import { cloudinaryDeleteImagesByPublicIds } from "@/lib/cloudinary";
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
  categories,
  subcategories,
} from "@repo/db/src/schema/not-related.schema";

const businessListing = schemas.business.businessListings;
const business_reviews = schemas.business.businessReviews;

export const businessrouter = router({
  add: visitorProcedure.query(async ({ ctx }) => {
    const getBusinessCategories = await db.query.categories.findMany({
      where: (categories, { eq }) => eq(categories.type, 1),
    });
    const getStates = await db.query.states.findMany();

    return {
      getBusinessCategories,
      getStates,
    };
    // const user = await db.query.users.findFirst({
    //   where: (user, { eq }) => eq(user.id, ctx.userId),
    // });
    // return user;
  }),

  getSubCategories: visitorProcedure
    .input(z.object({ categoryId: z.number() }))
    .query(async ({ ctx, input }) => {
      const businessSubCategories = await db.query.subcategories.findMany({
        where: (subcategories, { eq }) =>
          eq(subcategories.categoryId, input.categoryId),
      });
      return businessSubCategories;
    }),

  getCities: visitorProcedure
    .input(z.object({ state: z.number() }))
    .query(async ({ ctx, input }) => {
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
          eq(businessListings.email, String(input.email)),
      });

      if (existingEmail) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email address already exist",
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
        where: (cities, { eq }) => eq(cities.id, input.cityId),
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
        .insert(schemas.business.businessListings)
        .values({
          userId: ctx.userId,
          name: input.name,
          slug: slugifyName,
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
          pincode: input.pincode,
          state: input.state,
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
      // await db.insert(schemas.business.businessPhotos).values({
      //   businessId,
      //   photo: input.photo,
      // });
      // await db.insert(schemas.business.businessPhotos).values(
      //   input.shopImages.map((image) => ({
      //     businessId,
      //     photo: image,
      //   })),
      // );
      await db
        .update(schemas.auth.users)
        .set({
          role: "business",
        })
        .where(eq(schemas.auth.users.id, ctx.userId));

      changeRoleInSession(ctx.sessionId, "business");
      return { success: true, message: "Business created successfully" };
    }),

  update: businessProcedure
    .input(businessUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const isBusinessExists = await db.query.businessListings.findFirst({
        where: (businessListings, { eq }) =>
          eq(businessListings.userId, ctx.userId),
      });

      if (!isBusinessExists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Business listing not found",
        });
      }

      const updateBusiness = await db
        .update(schemas.business.businessListings)
        .set({
          name: input.name,
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
          pincode: input.pincode,
          state: input.state,
          cityId: Number(input.cityId),
          schedules: input.schedules,
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

      await db
        .delete(schemas.business.businessSubcategories)
        .where(
          eq(
            schemas.business.businessSubcategories.businessId,
            isBusinessExists.id,
          ),
        );

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
    if (!ctx.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not logged in",
      });
    }
    const business = await db.query.businessListings.findFirst({
      where: (businessListings, { eq }) =>
        eq(businessListings.userId, ctx.userId),
    });

    if (!business?.cityId) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "City not found",
      });
    }

    const cityRecord = await db.query.cities.findFirst({
      where: (cities, { eq }) => eq(cities.id, business.cityId),
      columns: { id: true, city: true },
    });

    if (!cityRecord) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "City Record not found",
      });
    }

    if (!business?.state) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "State not found",
      });
    }

    const stateRecord = await db.query.states.findFirst({
      where: (states, { eq }) => eq(states.id, business.state),
      columns: { id: true, name: true },
    });

    if (!stateRecord) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "State record not found",
      });
    }

    const businessCategoryRecord = await db.query.businessCategories.findFirst({
      where: (businessCategories, { eq }) =>
        eq(businessCategories.businessId, business.id),
    });

    if (!businessCategoryRecord?.categoryId) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Category not found",
      });
    }

    const categoryRecord = await db.query.categories.findFirst({
      where: (categories, { eq }) =>
        eq(categories.id, businessCategoryRecord.categoryId),
      columns: { id: true, title: true },
    });
    if (!categoryRecord) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Category Record not found",
      });
    }

    const businessSubcategoryRecords =
      await db.query.businessSubcategories.findMany({
        where: (businessSubcategories, { eq }) =>
          eq(businessSubcategories.businessId, business.id),
      });

    const subcategoryIds = businessSubcategoryRecords.map(
      (item) => item.subcategoryId,
    );

    if (subcategoryIds.length === 0) {
      logger.info("No subcategories found for this business", subcategoryIds);
    }

    const subcategoryRecords = await db.query.subcategories.findMany({
      where: (subcategories, { inArray }) =>
        inArray(subcategories.id, subcategoryIds),
      columns: { id: true, name: true },
    });
    return {
      ...business,
      city: cityRecord,
      state: stateRecord,
      category: categoryRecord,
      subcategory: subcategoryRecords,
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

  addOffer: businessProcedure
    .input(offersInsertSchema)
    .mutation(async ({ ctx, input }) => {
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
      const slugifyName = slugify(input.offerName, {
        lower: true,
        strict: true,
      });

      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 5);
      const [offer] = await db
        .insert(schemas.offer.offers)
        .values({
          businessId: business.id,
          offerName: input.offerName,
          offerSlug: slugifyName,
          categoryId: input.categoryId,
          rate: input.rate,
          discountPercent: input.discountPercent,
          finalPrice: input.finalPrice,
          offerDescription: input.offerDescription,
          offerStartDate: startDate,
          offerEndDate: endDate,
        })
        .returning({
          id: offers.id,
        });

      if (!offer) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Offer not created",
        });
      }
      const offerId = offer.id;
      if (input.subcategoryId.length > 0) {
        await db.insert(schemas.offer.offerSubcategory).values(
          input.subcategoryId.map((subCategoryId) => ({
            offerId,
            subcategoryId: Number(subCategoryId),
          })),
        );
      }

      const allPhotos = [
        input.photo,
        input.image2,
        input.image3,
        input.image4,
        input.image5,
      ].filter(Boolean); // removes empty or null values

      if (allPhotos.length > 0) {
        await db.insert(schemas.offer.offerPhotos).values(
          allPhotos.map((photo) => ({
            offerId,
            photo,
          })),
        );
      }

      return {
        success: true,
        message: "Offer added successfully",
      };
    }),

  showOffer: businessProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not logged in",
      });
    }
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

    const offers = await db.query.offers.findMany({
      where: (offers, { eq }) => eq(offers.businessId, business.id),
      with: {
        offerPhotos: true,
      },
    });

    return { offers };
  }),
  addProduct: businessProcedure
    .input(productInsertSchema)
    .mutation(async ({ ctx, input }) => {
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
      const slugifyName = slugify(input.productName, {
        lower: true,
        strict: true,
      });

      const [product] = await db
        .insert(schemas.product.products)
        .values({
          businessId: business.id,
          productName: input.productName,
          productSlug: slugifyName,
          categoryId: input.categoryId,
          rate: input.rate,
          discountPercent: input.discountPercent,
          finalPrice: input.finalPrice,
          productDescription: input.productDescription,
        })
        .returning({
          id: products.id,
        });

      if (!product) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Offer not created",
        });
      }
      const productId = product.id;
      if (input.subcategoryId.length > 0) {
        await db.insert(schemas.product.productSubCategories).values(
          input.subcategoryId.map((subCategoryId) => ({
            productId,
            subcategoryId: Number(subCategoryId),
          })),
        );
      }

      const allPhotos = [
        input.photo,
        input.image2,
        input.image3,
        input.image4,
        input.image5,
      ].filter(Boolean); // removes empty or null values

      if (allPhotos.length > 0) {
        await db.insert(schemas.product.productPhotos).values(
          allPhotos.map((photo) => ({
            productId,
            photo,
          })),
        );
      }

      return {
        success: true,
        message: "Product added successfully",
      };
    }),

  showProduct: businessProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not looged in",
      });
    }

    const business = await db.query.businessListings.findFirst({
      where: (businessListings, { eq }) =>
        eq(businessListings.userId, ctx.userId),
    });

    // return { business}
    if (!business) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Business not found",
      });
    }

    const products = await db.query.products.findMany({
      where: (products, { eq }) => eq(products.businessId, business.id),
      with: {
        productPhotos: true,
      },
    });

    return { products };
  }),

  deleteProduct: businessProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // return { success: true};
      const allSeletedPhoto = await db.query.productPhotos.findMany({
        where: (productPhotos, { eq }) => eq(productPhotos.productId, input.id),
      });

      await cloudinaryDeleteImagesByPublicIds(
        allSeletedPhoto.map((item) => String(item.photo)),
      );
      // await db
      //   .delete(schemas.product.productSubCategories)
      //   .where(eq(schemas.product.productSubCategories.productId, input.id));

      await db
        .delete(schemas.product.products)
        .where(eq(schemas.product.products.id, input.id));

      return { success: true };
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
          rating: sql<{id:number,created_at:string,rating:number,message:string,user:string}[]>`COALESCE(
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
          businessSubcategories,
          eq(businessListing.id, businessSubcategories.businessId),
        )
        .leftJoin(products, eq(businessListing.id, products.businessId))
        .leftJoin(offers, eq(businessListing.id, offers.businessId))
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
          rating: sql<{id:number,created_at:string,rating:number,message:string,user:string}[]>`COALESCE(
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
          name: offers.offerName,
          rate: offers.rate,
          discountPercent: offers.discountPercent,
          finalPrice: offers.finalPrice,
          startDate: offers.offerStartDate,
          endDate: offers.offerEndDate,
          description: offers.offerDescription,
          createdAt: offers.createdAt,
          businessId: offers.businessId,
          shopName: sql<string | null>`COALESCE((
            SELECT name FROM business_listings LIMIT 1
          ), '')`,
          photos: sql<string[]>`COALESCE(
            ARRAY_AGG(DISTINCT offer_photos.photo)
            FILTER (WHERE offer_photos.id IS NOT NULL),
            '{}'
          )`,
        })
        .from(offers)
        .leftJoin(offerPhotos, eq(offerPhotos.offerId, offers.id))
        .leftJoin(businessListing, eq(businessListing.id, offers.businessId))
        .groupBy(offers.id)
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
        shop: sql<string[]>`COALESCE(
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
        rating: sql<
          string
        >`COALESCE(AVG(${schemas.business.businessReviews.rate}),0)`,
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
      .leftJoin(businessReviews,eq(favourites.businessId,businessReviews.businessId))
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
});
