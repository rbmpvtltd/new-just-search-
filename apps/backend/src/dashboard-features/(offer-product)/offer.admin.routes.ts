import { db } from "@repo/db";
import { businessListings } from "@repo/db/dist/schema/business.schema";
import {
  offerPhotos,
  offerSubcategory,
  offers,
  offersInsertSchema,
  offersUpdateSchema,
} from "@repo/db/dist/schema/offer.schema";
import { logger } from "@repo/logger";
import { TRPCError } from "@trpc/server";
import { and, eq, gte, inArray, sql } from "drizzle-orm";
import z from "zod";
import { cloudinaryDeleteImagesByPublicIds } from "@/lib/cloudinary";
import { slugify } from "@/lib/slugify";
import {
  buildOrderByClause,
  buildWhereClause,
  tableInputSchema,
} from "@/lib/tableUtils";
import { adminProcedure, router } from "@/utils/trpc";
import {
  offerAllowedSortColumns,
  offerColumns,
  offerGlobalFilterColumns,
} from "./offer.admin.service";

export const adminOfferRouter = router({
  list: adminProcedure.input(tableInputSchema).query(async ({ input }) => {
    const where = buildWhereClause(
      input.filters,
      input.globalFilter,
      offerColumns,
      offerGlobalFilterColumns,
    );

    const orderBy = buildOrderByClause(
      input.sorting,
      offerAllowedSortColumns,
      sql`created_at DESC`,
    );

    const offset = input.pagination.pageIndex * input.pagination.pageSize;

    const data = await db
      .select({
        id: offers.id,
        photo: offers.mainImage,
        offer_name: offers.offerName,
        business_name: businessListings.name,
        status: offers.status,
        expired_at: offers.offerEndDate,
        created_at: offers.createdAt,
      })
      .from(offers)
      .leftJoin(businessListings, eq(businessListings.id, offers.businessId))
      .where(where)
      .orderBy(orderBy)
      .limit(input.pagination.pageSize)
      .offset(offset);

    const totalResult = await db
      .select({
        count: sql<number>`count(distinct ${offers.id})::int`,
      })
      .from(offers)
      .where(where);

    const total = totalResult[0]?.count ?? 0;
    const totalPages = Math.ceil(total / input.pagination.pageSize);

    return {
      data,
      totalCount: total,
      totalPages,
      pageCount: totalPages,
    };
  }),
  add: adminProcedure.query(async () => {
    const getBusinessCategories = await db.query.categories.findMany({
      where: (categories, { eq }) => eq(categories.type, 1),
    });
    const allBusinessListings = await db.query.businessListings.findMany({
      columns: {
        name: true,
        id: true,
      },
    });
    return {
      allBusinessListings,
      getBusinessCategories,
    };
  }),

  getSubCategories: adminProcedure
    .input(z.object({ categoryId: z.number() }))
    .query(async ({ input }) => {
      const businessSubCategories = await db.query.subcategories.findMany({
        where: (subcategories, { eq }) =>
          eq(subcategories.categoryId, input.categoryId),
      });
      return businessSubCategories;
    }),

  getBusinessPlan: adminProcedure
    .input(z.object({ businessId: z.number() }))
    .query(async ({ input }) => {
      const userId = (
        await db.query.businessListings.findFirst({
          where: (businessList, { eq }) =>
            eq(businessList.id, input.businessId),
          columns: {
            userId: true,
          },
        })
      )?.userId;
      if (!userId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Business Not Found",
        });
      }
      const plan = await db.query.planUserActive.findFirst({
        where: (userPlan, { eq }) => eq(userPlan.planId, userId),
        columns: {
          features: true,
        },
      });

      const expireDate = new Date(
        Date.now() + (plan?.features.offerDuration ?? 0) * 24 * 60 * 60 * 1000,
      );

      return expireDate;
    }),
  create: adminProcedure
    .input(
      offersInsertSchema.extend({
        businessId: z.number(),
        offerExpireDate: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const business = await db.query.businessListings.findFirst({
        where: (businessListings, { eq }) =>
          eq(businessListings.id, input.businessId),
      });
      if (!business) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Business not found",
        });
      }

      const activeplan = await db.query.planUserActive.findFirst({
        where: (planUserActive, { eq }) =>
          eq(planUserActive.userId, business.userId),
      });

      if (!activeplan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Plan not found",
        });
      }

      const offerDuration = activeplan.features.offerDuration;
      const expireAt = new Date(
        now.getTime() + offerDuration * 24 * 60 * 60 * 1000,
      );

      const maxOfferPerDay = (
        await db
          .select({
            count: sql<number>`count(*)`,
          })
          .from(offers)
          .innerJoin(businessListings, eq(offers.businessId, business.id))
          .where(
            and(
              eq(businessListings.userId, business.userId),
              gte(offers.createdAt, last24Hours),
            ),
          )
      )[0]?.count;

      if (activeplan.features.maxOfferPerDay <= (maxOfferPerDay ?? 0)) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Today offer limit exceeded",
        });
      }

      const totalOffer = (
        await db
          .select({
            count: sql<number>`count(distinct ${offers.id})::int`,
          })
          .from(offers)
      )[0]?.count;

      if (activeplan.features.offerLimit <= (totalOffer ?? 0)) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Offer limit exceeded",
        });
      }
      const slugifyName = slugify(input.offerName);

      const startDate = new Date();
      const endDate = new Date(input.offerExpireDate) ?? new Date(startDate);
      endDate.setDate(startDate.getDate() + 5);
      console.log("Offer End Date", endDate);
      logger.info("Offer End Date", endDate);

      const [offer] = await db
        .insert(offers)
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
          expires_at: expireAt,
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
        await db.insert(offerSubcategory).values(
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
        await db.insert(offerPhotos).values(
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

  edit: adminProcedure
    .input(z.object({ offerId: z.number() }))
    .query(async ({ input }) => {
      const getBusinessCategories = await db.query.categories.findMany({
        where: (categories, { eq }) => eq(categories.type, 1),
      });
      const offer = await db.query.offers.findFirst({
        where: (offers, { and, eq }) => and(eq(offers.id, input.offerId)),
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

      const business = await db.query.businessListings.findFirst({
        where: (businessListings, { eq }) =>
          eq(businessListings.id, offer.businessId),
        columns: {
          id: true,
          name: true,
        },
      });

      if (!business) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Business not found",
        });
      }
      // const allBusinessListings = await db.query.businessListings.findMany({
      //   columns: {
      //     name: true,
      //     id: true,
      //   },
      // });
      const category = await db.query.businessCategories.findFirst({
        where: (businessCategories, { eq }) =>
          eq(businessCategories.businessId, business.id),
        columns: {
          categoryId: true,
        },
      });

      const subcategories = await db.query.businessSubcategories.findMany({
        where: (businessSubcategories, { eq }) =>
          eq(businessSubcategories.businessId, business.id),
        columns: {
          subcategoryId: true,
        },
      });

      const getSubCategories = await db.query.subcategories.findMany({
        where: (subcategories, { eq }) =>
          eq(subcategories.categoryId, Number(offer?.categoryId)),
        columns: {
          id: true,
          name: true,
        },
      });
      const offerPhotos = await db.query.offerPhotos.findMany({
        where: (offerPhotos, { eq }) => eq(offerPhotos.offerId, input.offerId),
        columns: {
          photo: true,
        },
      });
      return {
        offer,
        business,
        category,
        offerPhotos,
        subcategories,
        getSubCategories,
        getBusinessCategories,
      };
    }),

  update: adminProcedure
    .input(
      offersUpdateSchema.extend({
        offerExpireDate: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      console.log("Input", input);

      const business = await db.query.businessListings.findFirst({
        where: (businessListings, { eq }) =>
          eq(businessListings.id, Number(input.businessId)),
      });
      if (!business) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Business not found",
        });
      }

      const isOfferExists = await db.query.offers.findFirst({
        where: (offers, { eq }) => eq(offers.businessId, Number(business.id)),
      });
      if (!isOfferExists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Offer not found or does not belong to this business",
        });
      }

      console.log("offerEndDate", { offerEndDate: input.offerEndDate });
      console.log("offerExpireDate", {
        offerExpireDate: input.offerExpireDate,
      });
      const updateOffer = await db
        .update(offers)
        .set({
          mainImage: input.mainImage,
          offerName: input.offerName,
          categoryId: input.categoryId,
          rate: input.rate,
          discountPercent: input.discountPercent,
          finalPrice: input.finalPrice,
          offerDescription: input.offerDescription,
          offerEndDate:
            new Date(input.offerExpireDate) ?? isOfferExists.offerEndDate,
        })
        .where(eq(offers.id, isOfferExists.id));

      if (!updateOffer) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Offer not updated",
        });
      }

      await db
        .delete(offerSubcategory)
        .where(eq(offerSubcategory.offerId, isOfferExists.id));
      await db.insert(offerSubcategory).values(
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
        await db.insert(offerPhotos).values(
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

  multidelete: adminProcedure
    .input(
      z.object({
        ids: z.array(z.number()),
      }),
    )
    .mutation(async ({ input }) => {
      const allSeletedPhoto = await db
        .select({
          photo: offerPhotos.photo,
        })
        .from(offerPhotos)
        .where(inArray(offerPhotos.offerId, input.ids));

      if (allSeletedPhoto.length !== 0) {
        await cloudinaryDeleteImagesByPublicIds(
          allSeletedPhoto?.map((item) => String(item.photo)),
        );
        await db
          .delete(offerPhotos)
          .where(inArray(offerPhotos.offerId, input.ids));
      }

      logger.info("deleted");
      await db
        .delete(offerSubcategory)
        .where(inArray(offerSubcategory.offerId, input.ids));

      await db.delete(offers).where(inArray(offers.id, input.ids));

      return { success: true };
    }),

  // multiactive: adminProcedure
  //   .input(
  //     z.array(
  //       z.object({
  //         id: z.number(),
  //         isActive: z.boolean(),
  //       }),
  //     ),
  //   )
  //   .mutation(async ({ input }) => {
  //     await db
  //       .update(categories)
  //       .set({
  //         status: sql`CASE ${categories.id}
  //           ${sql.join(
  //             input.map(
  //               (item) =>
  //                 sql`WHEN ${item.id} THEN ${item.isActive ? sql`true` : sql`false`}`,
  //             ),
  //             sql` `,
  //           )}
  //               ELSE ${categories.status}
  //               END`,
  //       })
  //       .where(
  //         inArray(
  //           categories.id,
  //           input.map((item) => item.id),
  //         ),
  //       );
  //
  //     return { success: true };
  //   }),
  // multipopular: adminProcedure
  //   .input(
  //     z.array(
  //       z.object({
  //         id: z.number(),
  //         isActive: z.boolean(),
  //       }),
  //     ),
  //   )
  //   .mutation(async ({ input }) => {
  //     await db
  //       .update(categories)
  //       .set({
  //         isPopular: sql`CASE ${categories.id}
  //           ${sql.join(
  //             input.map(
  //               (item) =>
  //                 sql`WHEN ${item.id} THEN ${item.isActive ? sql`true` : sql`false`}`,
  //             ),
  //             sql` `,
  //           )}
  //               ELSE ${categories.isPopular}
  //               END`,
  //       })
  //       .where(
  //         inArray(
  //           categories.id,
  //           input.map((item) => item.id),
  //         ),
  //       );
  //
  //     return { success: true };
  //   }),
});
