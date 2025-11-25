// features/banners/banners.admin.routes.ts
import {
  bannerInsertSchema,
  banners,
  bannerUpdateSchema,
} from "@repo/db/src/schema/not-related.schema";
import { db } from "@repo/db";
import { logger } from "@repo/logger";
import { TRPCError } from "@trpc/server";
import { eq, inArray, sql } from "drizzle-orm";
import z from "zod";
import {
  cloudinaryDeleteImageByPublicId,
  cloudinaryDeleteImagesByPublicIds,
} from "@/lib/cloudinary";
import {
  buildOrderByClause,
  buildWhereClause,
  tableInputSchema,
} from "@/lib/tableUtils";
import { adminProcedure, router } from "@/utils/trpc";
import {
  bannerAllowedSortColumns,
  bannerColumns,
  bannerGlobalFilterColumns,
} from "./banners.admin.service";

export const adminBannerRouter = router({
  list: adminProcedure.input(tableInputSchema).query(async ({ input }) => {
    const where = buildWhereClause(
      input.filters,
      input.globalFilter,
      bannerColumns,
      bannerGlobalFilterColumns,
    );

    const orderBy = buildOrderByClause(
      input.sorting,
      bannerAllowedSortColumns,
      sql`id DESC`,
    );

    const offset = input.pagination.pageIndex * input.pagination.pageSize;

    const data = await db
      .select()
      .from(banners)
      .where(where)
      .orderBy(orderBy)
      .limit(input.pagination.pageSize)
      .offset(offset);

    // PostgreSQL returns `bigint` for count → cast to number
    const totalResult = await db
      .select({
        count: sql<number>`count(distinct ${banners.id})::int`,
      })
      .from(banners)
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
    return;
  }),
  create: adminProcedure
    .input(bannerInsertSchema)
    .mutation(async ({ input }) => {
      await db.insert(banners).values(input);
      return { success: true };
    }),
  edit: adminProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const data = await db
        .select()
        .from(banners)
        .where(eq(banners.id, input.id));
      return data[0];
    }),
  update: adminProcedure
    .input(bannerUpdateSchema)
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      logger.info("getting in backend");
      if (!id)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please pass id field",
        });
      const olddata = (
        await db.select().from(banners).where(eq(banners.id, id))
      )[0];
      if (olddata?.photo && olddata?.photo !== updateData.photo) {
        await cloudinaryDeleteImageByPublicId(olddata.photo);
      }
      await db.update(banners).set(updateData).where(eq(banners.id, id));
      return { success: true };
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
          photo: banners.photo,
        })
        .from(banners)
        .where(inArray(banners.id, input.ids));
      await cloudinaryDeleteImagesByPublicIds(
        allSeletedPhoto.map((item) => item.photo),
      );
      await db.delete(banners).where(inArray(banners.id, input.ids));
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
        .update(banners)
        .set({
          isActive: sql`CASE ${banners.id} 
            ${sql.join(
              input.map(
                (item) =>
                  sql`WHEN ${item.id} THEN ${item.isActive ? sql`true` : sql`false`}`,
              ),
              sql` `,
            )} 
                ELSE ${banners.isActive} 
                END`,
        })
        .where(
          inArray(
            banners.id,
            input.map((item) => item.id),
          ),
        );

      return { success: true };
    }),
});
