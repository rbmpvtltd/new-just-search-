import { EventEmitter, on } from "node:events";
import { db, schemas } from "@repo/db";
import { users } from "@repo/db/dist/schema/auth.schema";
import {
  chatTokenMessages,
  chatTokenSessionInsertSchema,
  chatTokenSessions,
} from "@repo/db/dist/schema/help-and-support.schema";
import { logger } from "@repo/logger";
import { TRPCError } from "@trpc/server";
import { eq, inArray } from "drizzle-orm";
import z from "zod";
import { protectedProcedure, router } from "@/utils/trpc";
import { tokenGenerator } from "./helpAndSupport.service";

const ee = new EventEmitter();

export const helpAndSupportRouter = router({
  onMessage: protectedProcedure
    .input(z.object({ chatTokenSessionId: z.number() }))
    .subscription(async function* ({ input }) {
      for await (const [msg] of on(
        ee,
        `helpAndSupportMessage${input.chatTokenSessionId}`,
      )) {
        yield msg;
      }
    }),
  create: protectedProcedure
    .input(chatTokenSessionInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const token = await tokenGenerator();
      logger.info("Token", { token: token });

      // TODO : Update this logic
      //check status
      const status = await db.query.chatTokenSessions.findFirst({
        where: (chatTokenSessions, { eq, and }) =>
          and(
            eq(chatTokenSessions.status, 1),
            eq(chatTokenSessions.userId, ctx.userId),
          ),
      });

      //Token already exists
      if (status) {
        logger.info("Status", { status: status });
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Token already exists",
        });
      }

      const [chatTokenSessionsId] = await db
        .insert(schemas.help_and_support.chatTokenSessions)
        .values({
          status: 1,
          tokenNumber: token,
          subject: input.subject,
          userId: ctx.userId,
        })
        .returning({ id: chatTokenSessions.id });

      // if (!chatTokenSessionsId) {
      //   return {
      //     success: false,
      //     message: "Token not created",
      //     status: 400,
      //   };
      // }

      logger.info("chatTokenSessionsId", {
        chatTokenSessionsId: chatTokenSessionsId,
      });

      const message = await db
        .insert(schemas.help_and_support.chatTokenMessages)
        .values({
          message: input.message,
          chatTokenSessionsId: chatTokenSessionsId?.id,
          sendByRole: "User",
        });
      logger.info("message", { message: message });

      return {
        success: true,
        status: 200,
        message: "Token created successfully",
        token: token,
      };
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        message: z.string(),
        chatTokenSessionId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [newMessage] = await db
        .insert(schemas.help_and_support.chatTokenMessages)
        .values({
          message: input.message,
          sendByRole: "User",
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

  messageList: protectedProcedure
    .input(z.object({ chatTokenSessionId: z.number() }))
    .query(async ({ ctx, input }) => {
      const message = await db.query.chatTokenMessages.findMany({
        where: (chatTokenMessages, { eq }) =>
          eq(chatTokenMessages.chatTokenSessionsId, input.chatTokenSessionId),
        orderBy: (chatTokenMessages, { asc }) => [asc(chatTokenMessages.id)],
      });

      return message;
    }),
  show: protectedProcedure.query(async ({ ctx }) => {
    const myTokens = await db.query.chatTokenSessions.findMany({
      where: (chatTokenSessions, { eq }) =>
        eq(chatTokenSessions.userId, ctx.userId),
    });

    return myTokens;
  }),

  markAsRead: protectedProcedure
    .input(z.object({ messageId: z.array(z.number()) }))
    .mutation(async ({ input, ctx }) => {
      if (input.messageId.length > 0) {
        await db
          .update(schemas.help_and_support.chatTokenMessages)
          .set({ isRead: true })
          .where(inArray(chatTokenMessages.id, input.messageId));
      }

      return {
        success: true,
        message: "Message marked as read successfully",
      };
    }),
});
