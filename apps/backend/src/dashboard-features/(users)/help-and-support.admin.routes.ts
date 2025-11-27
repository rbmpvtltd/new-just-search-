// features/banners/banners.admin.routes.ts
import { db } from "@repo/db";
import {
  categories,
  categoryUpdateSchema,
  subcategories,
} from "@repo/db/dist/schema/not-related.schema";
import {
  notification,
  notificationInsertSchema,
} from "@repo/db/dist/schema/user.schema";
import { TRPCError } from "@trpc/server";
import { desc, eq, inArray, sql } from "drizzle-orm";
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
  notificationAllowedSortColumns,
  notificationColumns,
  notificationGlobalFilterColumns,
} from "./notification.admin.service";

export const adminNotificationRouter = router({
  list: adminProcedure.input(tableInputSchema).query(async ({ input }) => {
    const where = buildWhereClause(
      input.filters,
      input.globalFilter,
      notificationColumns,
      notificationGlobalFilterColumns,
    );

    const orderBy = buildOrderByClause(
      input.sorting,
      notificationAllowedSortColumns,
      sql`created_at DESC`,
    );

    // const orderBy = sql`created_at DESC`;

    const offset = input.pagination.pageIndex * input.pagination.pageSize;

    const data = await db
      .select()
      .from(notification)
      .where(where)
      .orderBy(orderBy)
      .limit(input.pagination.pageSize)
      .offset(offset);

    const totalResult = await db
      .select({
        count: sql<number>`count(distinct ${notification.id})::int`,
      })
      .from(notification)
      // .leftJoin(categories, eq(subcategories.categoryId, categories.id))
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
    const lastNotificationId = (
      await db
        .select({
          notification_id: notification.notificationId,
        })
        .from(notification)
        .orderBy(desc(notification.notificationId))
        .limit(1)
    )[0]?.notification_id;
    const newNotificationId = Number(lastNotificationId ?? 0) + 1;
    return { newNotificationId };
  }),
  create: adminProcedure
    .input(notificationInsertSchema)
    .mutation(async ({ input }) => {
      await db.insert(notification).values(input);
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
        .from(categories)
        .where(eq(categories.id, input.id));
      return data[0];
    }),
  update: adminProcedure
    .input(categoryUpdateSchema)
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      if (!id)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please pass id field",
        });
      const olddata = (
        await db.select().from(categories).where(eq(categories.id, id))
      )[0];
      if (olddata?.photo && olddata?.photo !== updateData.photo) {
        await cloudinaryDeleteImageByPublicId(olddata.photo);
      }
      await db.update(categories).set(updateData).where(eq(categories.id, id));
      return { success: true };
    }),
  multidelete: adminProcedure
    .input(
      z.object({
        ids: z.array(z.number()),
      }),
    )
    .mutation(async ({ input }) => {
      //TODO: remove subcategory of these categories;
      const allSeletedPhoto = await db
        .select({
          photo: categories.photo,
        })
        .from(categories)
        .where(inArray(categories.id, input.ids));
      await cloudinaryDeleteImagesByPublicIds(
        allSeletedPhoto.map((item) => item.photo),
      );
      //TODO: test that subcategory is also deleting
      await db
        .delete(subcategories)
        .where(inArray(subcategories.categoryId, input.ids));
      await db.delete(categories).where(inArray(categories.id, input.ids));
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
        .update(notification)
        .set({
          status: sql`CASE ${notification.id} 
            ${sql.join(
              input.map(
                (item) =>
                  sql`WHEN ${item.id} THEN ${item.isActive ? sql`true` : sql`false`}`,
              ),
              sql` `,
            )}
                ELSE ${notification.status} 
                END`,
        })
        .where(
          inArray(
            notification.id,
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
