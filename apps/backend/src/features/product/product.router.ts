import { db, schemas } from "@repo/db";
import {
  productInsertSchema,
  products,
} from "@repo/db/dist/schema/product.schema";
import { logger } from "@repo/logger";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import slugify from "slugify";
import z from "zod";
import { cloudinaryDeleteImagesByPublicIds } from "@/lib/cloudinary";
import { businessProcedure, router, visitorProcedure } from "@/utils/trpc";

export const productrouter = router({
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

    logger.info("Subcategory Record", subcategoryRecord);
    return {
      categoryRecord,
      subcategoryRecord,
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

  edit: businessProcedure
    .input(z.object({ productSlug: z.string() }))
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

      const product = await db.query.products.findFirst({
        where: (products, { and, eq }) =>
          and(
            eq(products.productSlug, input.productSlug),
            eq(products.businessId, business.id),
          ),
        with: {
          productPhotos: true,
          productSubCategories: true,
        },
      });
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }
      return { product };
    }),
  update: businessProcedure
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

      const isProductExists = await db.query.products.findFirst({
        where: (products, { eq }) =>
          eq(products.productSlug, String(input.productSlug)),
      });

      if (!isProductExists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      const updateProduct = await db
        .update(schemas.product.products)
        .set({
          productName: input.productName,
          categoryId: input.categoryId,
          rate: input.rate,
          productDescription: input.productDescription,
        })
        .where(eq(schemas.product.products.id, isProductExists.id));

      if (!updateProduct) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Product not updated",
        });
      }

      await db
        .delete(schemas.product.productSubCategories)
        .where(
          eq(
            schemas.product.productSubCategories.productId,
            isProductExists.id,
          ),
        );
      await db.insert(schemas.product.productSubCategories).values(
        input.subcategoryId.map((subCategoryId) => ({
          productId: isProductExists.id,
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
        await db.insert(schemas.product.productPhotos).values(
          allPhotos.map((photo) => ({
            productId: isProductExists.id,
            photo,
          })),
        );
      }
      return {
        success: true,
        message: "Product updated successfully",
      };
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
});
