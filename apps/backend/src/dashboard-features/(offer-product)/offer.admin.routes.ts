import { db } from "@repo/db";
import { businessListings } from "@repo/db/dist/schema/business.schema";
import {
  offerPhotos,
  offerSubcategory,
  offers,
  offersInsertSchema,
  offersUpdateSchema,
} from "@repo/db/dist/schema/offer.schema";
import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import z from "zod";
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
        offerName: offers.offerName,
        businessName: businessListings.name,
        status: offers.status,
        expired_at: offers.createdAt,
        created_at: offers.createdAt,
      })
      .from(offers)
      .where(where)
      .orderBy(orderBy)
      .limit(input.pagination.pageSize)
      .leftJoin(businessListings, eq(businessListings.id, offers.businessId))
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

  create: adminProcedure
    .input(offersInsertSchema.extend({ businessId: z.number() }))
    .mutation(async ({ input }) => {
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
      const slugifyName = slugify(input.offerName);

      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 5);
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
      });
      if (!business) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Business not found",
        });
      }
      const allBusinessListings = await db.query.businessListings.findMany({
        columns: {
          name: true,
          id: true,
        },
      });
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
      const offerPhotos = await db.query.offerPhotos.findMany({
        where: (offerPhotos, { eq }) => eq(offerPhotos.offerId, input.offerId),
        columns: {
          photo: true,
        },
      });
      return {
        offer,
        category,
        subcategories,
        offerPhotos,
        getBusinessCategories,
        allBusinessListings,
      };
    }),

  update: adminProcedure
    .input(offersUpdateSchema.extend({ businessId: z.number() }))
    .mutation(async ({ input }) => {
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

      const isOfferExists = await db.query.offers.findFirst({
        where: (offers, { eq }) =>
          eq(offers.businessId, Number(input.businessId)),
      });
      if (!isOfferExists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Offer not found or does not belong to this business",
        });
      }
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
  // multidelete: adminProcedure
  //   .input(
  //     z.object({
  //       ids: z.array(z.number()),
  //     }),
  //   )
  //   .mutation(async ({ input }) => {
  //     //TODO: remove subcategory of these categories;
  //     const allSeletedPhoto = await db
  //       .select({
  //         photo: categories.photo,
  //       })
  //       .from(categories)
  //       .where(inArray(categories.id, input.ids));
  //     await cloudinaryDeleteImagesByPublicIds(
  //       allSeletedPhoto.map((item) => item.photo),
  //     );
  //     //TODO: test that subcategory is also deleting
  //     await db
  //       .delete(subcategories)
  //       .where(inArray(subcategories.categoryId, input.ids));
  //     await db.delete(categories).where(inArray(categories.id, input.ids));
  //     return { success: true };
  //   }),
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
