import { db, schemas } from "@repo/db";
import {
  offers,
  offersInsertSchema,
  offersUpdateSchema,
} from "@repo/db/src/schema/offer.schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import slugify from "slugify";
import z from "zod";
import { cloudinaryDeleteImagesByPublicIds } from "@/lib/cloudinary";
import { businessProcedure, router, visitorProcedure } from "@/utils/trpc";

export const offerrouter = router({
  add: visitorProcedure.query(async ({ ctx }) => {
    const getBusinessCategories = await db.query.categories.findMany({
      where: (categories, { eq }) => eq(categories.type, 1),
    });
    const getStates = await db.query.states.findMany();

    return {
      getBusinessCategories,
      getStates,
    };
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

  showOffer: businessProcedure
    .input(
      z.object({
        lastId: z.number().nullish(),
        limit: z.number().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit;
      const lastId = input.lastId ?? 0;
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
            lastId ? gt(offers.id, lastId) : undefined,
          ),
        orderBy: (offers, { asc }) => [asc(offers.id)],
        limit,
        // with: {
        //   offerPhotos: true,
        // },
      });

      // if (!offers) {
      //   return { message: "Offers not found" };
      // }

      const nextId = offers.length > 0 ? offers[offers.length - 1]?.id : null;

      return { offers, nextId };
    }),

  edit: businessProcedure
    .input(z.object({ offerSlug: z.string() }))
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
          and(
            eq(offers.offerSlug, input.offerSlug),
            eq(offers.businessId, business.id),
          ),
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

      const isOfferExists = await db.query.offers.findFirst({
        where: (offers, { eq }) =>
          eq(offers.offerSlug, String(input.offerSlug)),
      });
      if (!isOfferExists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Offer not found or does not belong to this business",
        });
      }
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
        input.photo,
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
    .mutation(async ({ ctx, input }) => {
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
});
