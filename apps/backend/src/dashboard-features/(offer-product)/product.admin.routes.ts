import { db } from "@repo/db";
import { businessListings } from "@repo/db/dist/schema/business.schema";
import {
  productInsertSchema,
  productPhotos,
  productSubCategories,
  products,
  productUpdateSchema,
} from "@repo/db/dist/schema/product.schema";
import { TRPCError } from "@trpc/server";
import { eq, inArray, sql } from "drizzle-orm";
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
  productAllowedSortColumns,
  productColumns,
  productGlobalFilterColumns,
} from "./product.admin.service";

export const adminProductRouter = router({
  list: adminProcedure.input(tableInputSchema).query(async ({ input }) => {
    const where = buildWhereClause(
      input.filters,
      input.globalFilter,
      productColumns,
      productGlobalFilterColumns,
    );

    const orderBy = buildOrderByClause(
      input.sorting,
      productAllowedSortColumns,
      sql`created_at DESC`,
    );

    const offset = input.pagination.pageIndex * input.pagination.pageSize;

    const data = await db
      .select({
        id: products.id,
        photo: products.mainImage,
        productName: products.productName,
        businessName: businessListings.name,
        status: products.status,
        expired_at: products.createdAt,
        created_at: products.createdAt,
      })
      .from(products)
      .where(where)
      .orderBy(orderBy)
      .limit(input.pagination.pageSize)
      .leftJoin(businessListings, eq(businessListings.id, products.businessId))
      .offset(offset);

    const totalResult = await db
      .select({
        count: sql<number>`count(distinct ${products.id})::int`,
      })
      .from(products)
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
    .input(productInsertSchema)
    .mutation(async ({ ctx, input }) => {
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
      const slugifyName = slugify(input.productName);

      const [product] = await db
        .insert(products)
        .values({
          mainImage: input.mainImage,
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
        await db.insert(productSubCategories).values(
          input.subcategoryId.map((subCategoryId) => ({
            productId,
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
        await db.insert(productPhotos).values(
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

  edit: adminProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input, ctx }) => {
      const getBusinessCategories = await db.query.categories.findMany({
        where: (categories, { eq }) => eq(categories.type, 1),
      });
      const product = await db.query.products.findFirst({
        where: (products, { and, eq }) => and(eq(products.id, input.productId)),
        with: {
          productPhotos: true,
          productSubCategories: true,
        },
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found or does not belong to this business",
        });
      }

      const business = await db.query.businessListings.findFirst({
        where: (businessListings, { eq }) =>
          eq(businessListings.id, Number(product.businessId)),
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
      const productPhotos = await db.query.productPhotos.findMany({
        where: (productPhotos, { eq }) =>
          eq(productPhotos.productId, input.productId),
        columns: {
          photo: true,
        },
      });
      return {
        product,
        category,
        subcategories,
        productPhotos,
        getBusinessCategories,
        allBusinessListings,
      };
    }),

  update: adminProcedure
    .input(productUpdateSchema)
    .mutation(async ({ input }) => {
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

      const isProductExists = await db.query.products.findFirst({
        where: (products, { eq }) =>
          eq(products.businessId, Number(input.businessId)),
      });

      if (!isProductExists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }
      const updateProduct = await db
        .update(products)
        .set({
          productName: input.productName,
          mainImage: input.mainImage,
          categoryId: input.categoryId,
          rate: input.rate,
          productDescription: input.productDescription,
        })
        .where(eq(products.id, isProductExists.id));

      if (!updateProduct) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Product not updated",
        });
      }

      await db
        .delete(productSubCategories)
        .where(eq(productSubCategories.productId, isProductExists.id));
      await db.insert(productSubCategories).values(
        input.subcategoryId.map((subCategoryId) => ({
          productId: isProductExists.id,
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
        await db.insert(productPhotos).values(
          allPhotos.map((photo) => ({
            productId: isProductExists.id,
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
          photo: productPhotos.photo,
        })
        .from(productPhotos)
        .where(inArray(productPhotos.productId, input.ids));

      if (allSeletedPhoto.length !== 0) {
        await cloudinaryDeleteImagesByPublicIds(
          allSeletedPhoto?.map((item) => String(item.photo)),
        );
        await db
          .delete(productPhotos)
          .where(inArray(productPhotos.productId, input.ids));
      }

      await db
        .delete(productSubCategories)
        .where(inArray(productSubCategories.productId, input.ids));

      await db.delete(products).where(inArray(products.id, input.ids));

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
