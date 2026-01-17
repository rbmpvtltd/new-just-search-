// features/banners/banners.admin.routes.ts

import { profile } from "node:console";
import { EventEmitter, on } from "node:events";
import { db } from "@repo/db";
import { users } from "@repo/db/dist/schema/auth.schema";
import {
  chatTokenMessages,
  chatTokenSessions,
} from "@repo/db/dist/schema/help-and-support.schema";
import {
  categories,
  subcategories,
} from "@repo/db/dist/schema/not-related.schema";
import { notification, profiles } from "@repo/db/dist/schema/user.schema";
import { eq, inArray, sql } from "drizzle-orm";
import z from "zod";
import { cloudinaryDeleteImagesByPublicIds } from "@/lib/cloudinary";
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

const ee = new EventEmitter();

export const adminHelpAndSupportRouter = router({
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
      .from(chatTokenSessions)
      .where(where)
      .orderBy(orderBy)
      .limit(input.pagination.pageSize)
      .offset(offset);

    const totalResult = await db
      .select({
        count: sql<number>`count(distinct ${chatTokenSessions.id})::int`,
      })
      .from(chatTokenSessions)
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

  onMessage: adminProcedure
    .input(z.object({ chatTokenSessionId: z.number() }))
    .subscription(async function* ({ input }) {
      for await (const [msg] of on(
        ee,
        `helpAndSupportMessage${input.chatTokenSessionId}`,
      )) {
        yield msg;
      }
    }),
  sendMessage: adminProcedure
    .input(
      z.object({
        message: z.string(),
        chatTokenSessionId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [newMessage] = await db
        .insert(chatTokenMessages)
        .values({
          message: input.message,
          sendByRole: "Admin",
          chatTokenSessionsId: input.chatTokenSessionId,
        })
        .returning();
      ee.emit(`helpAndSupportMessage${input.chatTokenSessionId}`, newMessage);
      return {
        success: true,
        message: "Message sent successfully",
        data: newMessage,
      };
    }),
  add: adminProcedure
    .input(z.object({ chatTokenSessionId: z.number() }))
    .query(async ({ ctx, input }) => {
      const message = await db.query.chatTokenMessages.findMany({
        where: (chatTokenMessages, { eq }) =>
          eq(chatTokenMessages.chatTokenSessionsId, input.chatTokenSessionId),
        orderBy: (chatTokenMessages, { asc }) => [asc(chatTokenMessages.id)],
      });

      return message;
    }),

  getUser: adminProcedure
    .input(z.object({ chatTokenSessionId: z.number() }))
    .query(async ({ input }) => {
      const token = await db.query.chatTokenSessions.findFirst({
        where: (chatTokenSessions, { eq }) =>
          eq(chatTokenSessions.id, input.chatTokenSessionId),
      });

      const user = await db
        .select({
          displayName: users.displayName,
          profileImage: profiles.profileImage,
        })
        .from(users)
        .where(eq(users.id, Number(token?.userId)))
        .leftJoin(profiles, eq(profiles.userId, users.id));

      return user;
    }),

  markAsRead: adminProcedure
    .input(z.object({ messageId: z.array(z.number()) }))
    .mutation(async ({ input, ctx }) => {
      if (input.messageId.length > 0) {
        await db
          .update(chatTokenMessages)
          .set({ isRead: true })
          .where(inArray(chatTokenMessages.id, input.messageId));
      }

      return {
        success: true,
        message: "Message marked as read successfully",
      };
    }),

  changeStatus: adminProcedure
    .input(z.object({ chatTokenSessionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const token = await db.query.chatTokenSessions.findFirst({
        where: (chatTokenSessions, { eq }) =>
          eq(chatTokenSessions.id, input.chatTokenSessionId),
      });
      if (token) {
        await db
          .update(chatTokenSessions)
          .set({ status: 0 })
          .where(eq(chatTokenSessions.id, input.chatTokenSessionId));
      }
      return {
        token,
        success: true,
        message: "Status changed successfully",
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
          photo: categories.photo,
        })
        .from(categories)
        .where(inArray(categories.id, input.ids));
      await cloudinaryDeleteImagesByPublicIds(
        allSeletedPhoto.map((item) => item.photo),
      );
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
