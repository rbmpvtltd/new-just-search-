// features/banners/banners.admin.routes.ts
import { db } from "@repo/db";
// import { users } from "@repo/db/dist/schema/auth.schema";
import { businessListings } from "@repo/db/dist/schema/business.schema";
// import {
//   offerCategories,
//   offers,
//   offerSubcategories,
// } from "@repo/db/dist/schema/offer.schema";
// import {
//   categories,
//   cities,
//   subcategories,
// } from "@repo/db/dist/schema/not-related.schema";
import {
  offerPhotos,
  offerSubcategory,
  offers,
  offersInsertSchema,
} from "@repo/db/dist/schema/offer.schema";
import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import slugify from "slugify";
import z from "zod";
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
  add: adminProcedure.query(async ({ ctx }) => {
    const getBusinessCategories = await db.query.categories.findMany({
      where: (categories, { eq }) => eq(categories.type, 1),
    });
    const users = await db.query.users.findMany({
      where: (user, { eq }) => eq(user.role, "visiter"),
      columns: {
        displayName: true,
        id: true,
      },
    });
    return {
      users,
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
