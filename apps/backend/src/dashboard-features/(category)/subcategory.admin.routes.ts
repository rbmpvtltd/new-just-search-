// features/banners/banners.admin.routes.ts
import { db } from "@repo/db";
import {
  categories,
  subcategories,
  subcategoryInsertSchema,
  subcategoryupdateschema,
} from "@repo/db/dist/schema/not-related.schema";
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
  subCategoryColumns,
  subcategoryAllowedSortColumns,
  subcategoryGlobalFilterColumns,
} from "./subcategory.admin.service";

export const adminSubcategoryRouter = router({
  list: adminProcedure.input(tableInputSchema).query(async ({ input }) => {
    const where = buildWhereClause(
      input.filters,
      input.globalFilter,
      subCategoryColumns,
      subcategoryGlobalFilterColumns,
    );

    const orderBy = buildOrderByClause(
      input.sorting,
      subcategoryAllowedSortColumns,
      sql`created_at DESC`,
    );

    // const orderBy = sql`created_at DESC`;

    const offset = input.pagination.pageIndex * input.pagination.pageSize;

    const data = await db
      .select({
        id: subcategories.id,
        name: subcategories.name,
        status: subcategories.status,
        title: categories.title,
        created_at: subcategories.createdAt,
      })
      .from(subcategories)
      .where(where)
      .orderBy(orderBy)
      .limit(input.pagination.pageSize)
      .leftJoin(categories, eq(subcategories.categoryId, categories.id))
      .offset(offset);

    // PostgreSQL returns `bigint` for count → cast to number
    const totalResult = await db
      .select({
        count: sql<number>`count(distinct ${subcategories.id})::int`,
      })
      .from(subcategories)
      .leftJoin(categories, eq(subcategories.categoryId, categories.id))
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
    const categories = await db.query.categories.findMany({
      columns: {
        title: true,
        id: true,
      },
    });
    return { categories };
  }),
  create: adminProcedure
    .input(subcategoryInsertSchema)
    .mutation(async ({ input }) => {
      console.log("Input", input);

      const slug = slugify(input.name);
      console.log("Slug", { slug });
      try {
        const data = await db.insert(subcategories).values({
          ...input,
          slug: slug,
        });
        console.log("data", data);
      } catch (error) {
        console.log(error);
      }

      return { success: true };
    }),
  edit: adminProcedure.input(z.number()).query(async ({ input }) => {
    const data = (
      await db.select().from(subcategories).where(eq(subcategories.id, input))
    )[0];
    const categories = await db.query.categories.findMany({
      columns: {
        title: true,
        id: true,
      },
    });
    return { data, categories };
  }),
  update: adminProcedure
    .input(subcategoryupdateschema)
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      if (!id)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please pass id field",
        });
      await db
        .update(subcategories)
        .set(updateData)
        .where(eq(subcategories.id, id));
      return { success: true };
    }),
  multidelete: adminProcedure
    .input(
      z.object({
        ids: z.array(z.number()),
      }),
    )
    .mutation(async ({ input }) => {
      // const allSeletedPhoto = await db
      //   .select({
      //     photo: categories.photo,
      //   })
      //   .from(categories)
      //   .where(inArray(categories.id, input.ids));
      // await cloudinaryDeleteImagesByPublicIds(
      //   allSeletedPhoto.map((item) => item.photo),
      // );
      await db
        .delete(subcategories)
        .where(inArray(subcategories.id, input.ids));
      // await db.delete(categories).where(inArray(categories.id, input.ids));
      return { success: true };
    }),
  multiactive: adminProcedure
    .input(
      z.array(
        z.object({
          id: z.number(),
          isActive: z.boolean(),
        }),
      ),
    )
    .mutation(async ({ input }) => {
      await db
        .update(categories)
        .set({
          status: sql`CASE ${categories.id} 
            ${sql.join(
              input.map(
                (item) =>
                  sql`WHEN ${item.id} THEN ${item.isActive ? sql`true` : sql`false`}`,
              ),
              sql` `,
            )}
                ELSE ${categories.status} 
                END`,
        })
        .where(
          inArray(
            categories.id,
            input.map((item) => item.id),
          ),
        );

      return { success: true };
    }),
  multipopular: adminProcedure
    .input(
      z.array(
        z.object({
          id: z.number(),
          isActive: z.boolean(),
        }),
      ),
    )
    .mutation(async ({ input }) => {
      await db
        .update(categories)
        .set({
          isPopular: sql`CASE ${categories.id} 
            ${sql.join(
              input.map(
                (item) =>
                  sql`WHEN ${item.id} THEN ${item.isActive ? sql`true` : sql`false`}`,
              ),
              sql` `,
            )} 
                ELSE ${categories.isPopular} 
                END`,
        })
        .where(
          inArray(
            categories.id,
            input.map((item) => item.id),
          ),
        );

      return { success: true };
    }),
});
