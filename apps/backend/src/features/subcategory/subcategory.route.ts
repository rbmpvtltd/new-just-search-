import { publicProcedure, router } from "@/utils/trpc";
import z from "zod";
import { db, schemas } from "@repo/db";
import { count, eq  } from "drizzle-orm";

const businessListings = schemas.business.businessListings;
const businessCategories = schemas.business.businessCategories;

export const subcategoryRouter = router({
  subcategory: publicProcedure
    .input(
      z.object({
        categoryId: z.number(),
        limit: z.number().min(1).max(20).nullish(),
        page: z.number().min(1),
      }),
    )
    .query(async ({ input }) => {
      console.log("execution comes here");
      const limit = input.limit ?? 10;
      const offset = (input.page - 1) * limit;

      const data = await db
        .select({businessListings})
        .from(businessListings)
        .innerJoin(
          businessCategories,
          eq(businessListings.id, businessCategories.businessId),
        )
        .where(eq(businessCategories.categoryId, input.categoryId))
        .limit(limit)
        .offset(offset);

      const totalCount = await db
        .select({ count: count() })
        .from(businessListings)
        .innerJoin(
          businessCategories,
          eq(businessListings.id, businessCategories.businessId),
        )
        .where(eq(businessCategories.categoryId, input.categoryId));

      return {
        data,
        page: input.page,
        totalPages: Math.ceil((Number(totalCount[0]?.count ?? 0)) / limit),
      };
    }),
});
