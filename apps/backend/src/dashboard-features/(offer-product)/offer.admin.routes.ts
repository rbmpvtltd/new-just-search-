// features/banners/banners.admin.routes.ts
import { db } from "@repo/db";
import { users } from "@repo/db/src/schema/auth.schema";
// import {
//   offerCategories,
//   offers,
//   offerSubcategories,
// } from "@repo/db/src/schema/offer.schema";
import {
  categories,
  cities,
  subcategories,
} from "@repo/db/src/schema/not-related.schema";
import { eq, sql } from "drizzle-orm";
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
import { offers } from "@repo/db/src/schema/offer.schema";

export const adminOfferRouter = router({
  // list: adminProcedure.input(tableInputSchema).query(async ({ input }) => {
  //   const where = buildWhereClause(
  //     input.filters,
  //     input.globalFilter,
  //     offerColumns,
  //     offerGlobalFilterColumns,
  //   );

  //   const orderBy = buildOrderByClause(
  //     input.sorting,
  //     offerAllowedSortColumns,
  //     sql`created_at DESC`,
  //   );

  //   const offset = input.pagination.pageIndex * input.pagination.pageSize;

  //   const data = await db
  //     .select({
  //       id: offers.id,
  //       photo: offers.businessId,
  //       name: offers.categoryId,
  //       phone: users.phoneNumber,
  //       city: cities.city,
  //       category:
  //         sql<string>`string_agg(DISTINCT ${categories.title}, ', ' ORDER BY ${categories.title})`.as(
  //           "category",
  //         ),
  //       subcategories:
  //         sql<string>`string_agg(DISTINCT ${subcategories.name}, ', ' ORDER BY ${subcategories.name})`.as(
  //           "subcategories",
  //         ),
  //       status: offers.status,
  //       created_at: offers.createdAt,
  //     })
  //     .from(offers)
  //     .where(where)
  //     .orderBy(orderBy)
  //     .limit(input.pagination.pageSize)
  //     .leftJoin(users, eq(offers.userId, users.id))
  //     .leftJoin(cities, eq(offers.city, cities.id))
  //     .leftJoin(offers, eq(offers.id, offers.offerId))
  //     .leftJoin(subcategories, eq(offers.subcategoryId, subcategories.id))
  //     .leftJoin(offers, eq(offers.id, offers.offerId))
  //     .leftJoin(categories, eq(offers.categoryId, categories.id))
  //     .offset(offset)
  //     .groupBy(
  //       offers.id,
  //       offers.photo,
  //       offers.name,
  //       users.phoneNumber,
  //       cities.id,
  //       offers.status,
  //       offers.createdAt,
  //     );

  //   const totalResult = await db
  //     .select({
  //       count: sql<number>`count(distinct ${offers.id})::int`,
  //     })
  //     .from(offers)
  //     .where(where)
  //     .leftJoin(offerSubcategories, eq(offers.id, offerSubcategories.offerId))
  //     .leftJoin(
  //       subcategories,
  //       eq(offerSubcategories.subcategoryId, subcategories.id),
  //     )
  //     .leftJoin(offerCategories, eq(offers.id, offerCategories.offerId))
  //     .leftJoin(categories, eq(offerCategories.categoryId, categories.id))
  //     .leftJoin(users, eq(offers.userId, users.id));
  //   // .groupBy(offers.id);

  //   const total = totalResult[0]?.count ?? 0;
  //   const totalPages = Math.ceil(total / input.pagination.pageSize);

  //   return {
  //     data,
  //     totalCount: total,
  //     totalPages,
  //     pageCount: totalPages,
  //   };
  // }),
  // add: adminProcedure.query(async () => {
  //   return;
  // }),
  // create: adminProcedure
  //   .input(
  //     categoryInsertSchema.omit({
  //       slug: true,
  //     }),
  //   )
  //   .mutation(async ({ input }) => {
  //     const slug = slugify(input.title);
  //     await db.insert(categories).values({ ...input, slug });
  //     return { success: true };
  //   }),
  // edit: adminProcedure
  //   .input(
  //     z.object({
  //       id: z.number(),
  //     }),
  //   )
  //   .query(async ({ input }) => {
  //     const data = await db
  //       .select()
  //       .from(categories)
  //       .where(eq(categories.id, input.id));
  //     return data[0];
  //   }),
  // update: adminProcedure
  //   .input(categoryUpdateSchema)
  //   .mutation(async ({ input }) => {
  //     const { id, ...updateData } = input;
  //     if (!id)
  //       throw new TRPCError({
  //         code: "BAD_REQUEST",
  //         message: "Please pass id field",
  //       });
  //     const olddata = (
  //       await db.select().from(categories).where(eq(categories.id, id))
  //     )[0];
  //     if (olddata?.photo && olddata?.photo !== updateData.photo) {
  //       await cloudinaryDeleteImageByPublicId(olddata.photo);
  //     }
  //     await db.update(categories).set(updateData).where(eq(categories.id, id));
  //     return { success: true };
  //   }),
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
