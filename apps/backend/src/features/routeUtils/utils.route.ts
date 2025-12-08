import { db } from "@repo/db";
import { cities, subcategories } from "@repo/db/dist/schema/not-related.schema";
import { inArray } from "drizzle-orm";
import z from "zod";
import { protectedProcedure, router } from "@/utils/trpc";

export const utilsRouter = router({
  getSubCategories: protectedProcedure
    .input(z.array(z.number()))
    .query(async ({ input }) => {
      const subCategoriesByCategories = await db
        .select({
          name: subcategories.name,
          id: subcategories.id,
        })
        .from(subcategories)
        .where(inArray(subcategories.categoryId, input));
      return subCategoriesByCategories;
    }),
  getCities: protectedProcedure
    .input(z.array(z.number()))
    .query(async ({ input }) => {
      const citiesByStates = await db
        .select({
          name: cities.city,
          id: cities.id,
        })
        .from(cities)
        .where(inArray(cities.stateId, input));
      return citiesByStates;
    }),
  // categoryInfinate: publicProcedure
  //   .input(
  //     z.object({
  //       name: z.string(),
  //       cursor: z.number(),
  //       limit: z.number().min(1).max(100).nullish(),
  //     }),
  //   )
  //   .query(async ({ input }) => {
  //     const limit = input.limit ?? 50;
  //
  //     const data = await db
  //       .select({
  //         id: categories.id,
  //         name: categories.title,
  //       })
  //       .from(categories)
  //       .where(
  //         and(
  //           gt(categories.id, input.cursor),
  //           ilike(categories.title, `%${input.name}%`),
  //         ),
  //       )
  //       .limit(limit);
  //
  //     const nextCursor = data[data.length - 1]?.id;
  //
  //     return {
  //       data,
  //       nextCursor,
  //     };
  //   }),
  // subCategoryInfinate: publicProcedure
  //   .input(
  //     z.object({
  //       name: z.string(),
  //       cursor: z.number(),
  //       categoryId: z.number(),
  //       limit: z.number().min(1).max(20).nullish(),
  //     }),
  //   )
  //   .query(async ({ input }) => {
  //     const limit = input.limit ?? 10;
  //
  //     const data = await db
  //       .select({
  //         id: subcategories.id,
  //         name: subcategories.name,
  //         category_id: subcategories.categoryId,
  //       })
  //       .from(subcategories)
  //       .where(
  //         and(
  //           eq(subcategories.categoryId, input.categoryId),
  //           gt(subcategories.id, input.cursor),
  //           ilike(categories.title, `%${input.name}%`),
  //         ),
  //       )
  //       .limit(limit);
  //
  //     const nextCursor = data[data.length - 1]?.id;
  //
  //     return {
  //       data,
  //       nextCursor,
  //     };
  //   }),
});
