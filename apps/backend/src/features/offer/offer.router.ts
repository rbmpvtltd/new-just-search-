import { db, schemas } from "@repo/db";
import {
  insertOfferReviewSchema,
  offers,
  offersInsertSchema,
  offersUpdateSchema,
} from "@repo/db/dist/schema/offer.schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import slugify from "slugify";
import z from "zod";
import { cloudinaryDeleteImagesByPublicIds } from "@/lib/cloudinary";
import { businessProcedure, protectedProcedure, router } from "@/utils/trpc";
import { createOfferReview, offerReviewExist } from "./offer.service";

export const offerrouter = router({
  add: businessProcedure.query(async ({ ctx }) => {
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
    const getBusinessCategories = await db.query.businessCategories.findFirst({
      where: (businessCategories, { eq }) =>
        eq(businessCategories.businessId, business?.id),
      columns: { categoryId: true, id: true },
    });

    if (!getBusinessCategories?.categoryId) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Category not found",
      });
    }

    const categoryRecord = await db.query.categories.findFirst({
      where: (categories, { eq }) =>
        eq(categories.id, getBusinessCategories?.categoryId),
      columns: { id: true, title: true },
    });

    if (!categoryRecord) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Category not found",
      });
    }
    const subcategoryRecord = await db.query.subcategories.findMany({
      where: (subcategories, { eq }) =>
        eq(subcategories.categoryId, categoryRecord?.id),
      columns: { id: true, name: true },
    });

    return {
      categoryRecord,
      subcategoryRecord,
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
          mainImage: input.mainImage,
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

  showOffer: businessProcedure
    .input(
      z.object({
        cursor: z.number(),
        limit: z.number().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit;
      const cursor = input.cursor ?? 0;
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
        where: (offers, { and, gt, eq }) =>
          and(
            eq(offers.businessId, business.id),
            cursor ? gt(offers.id, cursor) : undefined,
          ),
        orderBy: (offers, { asc }) => [asc(offers.id)],
        limit,
        with: {
          offerPhotos: true,
        },
      });

      // if (!offers) {
      //   return { message: "Offers not found" };
      // }

      const nextCursor =
        offers.length > 0 ? offers[offers.length - 1]?.id : null;

      return { offers, nextCursor };
    }),

  edit: businessProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
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

      const offer = await db.query.offers.findFirst({
        where: (offers, { and, eq }) =>
          and(eq(offers.id, input.id), eq(offers.businessId, business.id)),
        with: {
          offerPhotos: true,
          offerSubcategory: true,
        },
      });

      if (!offer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Offer not found or does not belong to this business",
        });
      }

      return { offer };
    }),

  update: businessProcedure
    .input(offersUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      console.log("I am inside update offer start");
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

      console.log("I am inside update offer 2");
      console.log("Consoling input", input);
      const isOfferExists = await db.query.offers.findFirst({
        where: (offers, { eq }) => eq(offers.id, Number(input.id)),
      });
      if (!isOfferExists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Offer not found or does not belong to this business",
        });
      }
      console.log("I am inside update offer 3");
      const updateOffer = await db
        .update(schemas.offer.offers)
        .set({
          offerName: input.offerName,
          categoryId: input.categoryId,
          rate: input.rate,
          discountPercent: input.discountPercent,
          finalPrice: input.finalPrice,
          offerDescription: input.offerDescription,
        })
        .where(eq(schemas.offer.offers.id, isOfferExists.id));

      if (!updateOffer) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Offer not updated",
        });
      }

      await db
        .delete(schemas.offer.offerSubcategory)
        .where(eq(schemas.offer.offerSubcategory.offerId, isOfferExists.id));
      await db.insert(schemas.offer.offerSubcategory).values(
        input.subcategoryId.map((subCategoryId) => ({
          offerId: isOfferExists.id,
          subcategoryId: Number(subCategoryId),
        })),
      );

      const allPhotos = [
        input.image2,
        input.image3,
        input.image4,
        input.image5,
      ].filter(Boolean); // removes empty or null values

      if (allPhotos.length > 0) {
        await db.insert(schemas.offer.offerPhotos).values(
          allPhotos.map((photo) => ({
            offerId: isOfferExists.id,
            photo,
          })),
        );
      }

      console.log("I am inside update offer end");
      return {
        success: true,
        message: "Offer updated successfully",
      };
    }),

  deleteOffer: businessProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      // return { success: true};
      const allSeletedPhoto = await db.query.offerPhotos.findMany({
        where: (offerPhotos, { eq }) => eq(offerPhotos.offerId, input.id),
      });

      await cloudinaryDeleteImagesByPublicIds(
        allSeletedPhoto.map((item) => String(item.photo)),
      );
      // await db
      //   .delete(schemas.product.productSubCategories)
      //   .where(eq(schemas.product.productSubCategories.productId, input.id));

      await db
        .delete(schemas.offer.offers)
        .where(eq(schemas.offer.offers.id, input.id));

      return { success: true };
    }),
  createOfferReview: protectedProcedure
    .input(insertOfferReviewSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, message, name, offerId, rate, status, view } = input;
      const { userId } = ctx;
      const reviewExist = await offerReviewExist(userId, offerId, email ?? "");
      if (reviewExist) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You've already submitted review on that offer",
        });
      }
      const data = await createOfferReview(
        userId,
        offerId,
        rate ?? 0,
        message ?? "",
        name ?? "",
        email ?? "",
        status,
        view,
      );
      return { success: true, data: data };
    }),
  offerReviewSubmitted: protectedProcedure
    .input(z.object({ offerId: z.number() }))
    .query(async ({ input, ctx }) => {
      const { offerId } = input;
      const { userId } = ctx;
      const submitted = await offerReviewExist(userId, offerId);
      return { submitted: submitted };
    }),
});
