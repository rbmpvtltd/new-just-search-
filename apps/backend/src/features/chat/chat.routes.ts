import { EventEmitter, on } from "node:events";
import { db, schemas } from "@repo/db";
import { conversations, productChat } from "@repo/db/dist/schema/chat.schema";
import { users } from "@repo/db/src/schema/auth.schema";
import { profiles } from "@repo/db/src/schema/user.schema";
import { logger } from "@repo/logger";
import { TRPCError, tracked } from "@trpc/server";
import { secrets } from "bun";
import { and, eq, ne, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import z from "zod";
import { protectedProcedure, router } from "@/utils/trpc";

const ee = new EventEmitter();
export const chatRouter = router({
  onMessage: protectedProcedure
    .input(
      z.object({ conversationId: z.number(), messageId: z.string().nullish() }),
    )
    .subscription(async function* ({ input }) {
      // if (input.messageId) {
      //   const lastMessage = await db.query.messages.findMany({
      //     where: (messages, { gt }) => gt(messages.id, Number(input.messageId)),
      //   });

      //   for (const msg of lastMessage) {
      //     yield tracked(String(msg?.id), msg);
      //   }
      // }
      for await (const [msg] of on(ee, `message${input.conversationId}`)) {
        yield msg;
      }
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        // userId: z.string(),
        message: z.string(),
        conversationId: z.number(),
        route: z.string().optional(),
        image: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      logger.info("input is", { input: input });
      const user = await db.query.users.findFirst({
        where: (user, { eq }) => eq(user.id, ctx.userId),
      });

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });
      }

      const [newMessage] = await db
        .insert(schemas.chat.messages)
        .values({
          conversationId: Number(input.conversationId),
          senderId: ctx.userId,
          message: input.message,
        })
        .returning();
      logger.info("newMessage is", { newMessage: newMessage });
      if ((input.route || input.image) && newMessage) {
        const [newProduct] = await db
          .insert(schemas.chat.productChat)
          .values({
            imageLink: input.image || "",
            messageId: newMessage.id,
            route: input.route || "",
          })
          .returning();
        logger.info("newMessage is", { newProduct: newProduct });
      }
      ee.emit(`message${input.conversationId}`, newMessage); //receiver
      // ee.emit(`message${user.id}`, { text: newMessage }); //sender
      return {
        success: true,
        message: "Message sent successfully",
        data: newMessage,
      };
    }),

  createConversation: protectedProcedure
    .input(z.object({ receiverId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      logger.info("Input isConversationExists", input, typeof input.receiverId);

      const business = await db.query.businessListings.findFirst({
        where: (businessListings, { eq }) =>
          eq(businessListings.id, input.receiverId),
      });
      logger.info("business is", { business: business });
      if (!business) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Business not found",
        });
      }

      const user = await db.query.users.findFirst({
        where: (user, { eq }) => eq(user.id, business?.userId),
      });
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });
      }
      const isConversationExists = await db.query.conversations.findFirst({
        where: (conversations, { or, eq, and }) =>
          or(
            and(
              eq(conversations.participantOneId, ctx.userId),
              eq(conversations.participantTwoId, business?.userId),
            ),
            and(
              eq(conversations.participantOneId, business?.userId),
              eq(conversations.participantTwoId, ctx.userId),
            ),
          ),
      });
      logger.info("isConversationExists is", {
        isConversationExists: isConversationExists,
      });
      if (isConversationExists) {
        return isConversationExists;
      }

      const newConversation = await db
        .insert(schemas.chat.conversations)
        .values({
          participantOneId: ctx.userId,
          participantTwoId: user.id,
        })
        .returning();
      return newConversation[0];
    }),

  conversationList: protectedProcedure.query(async ({ ctx, input }) => {
    const conversation = await db
      .selectDistinct({
        id: conversations.id,
        participantOneId: conversations.participantOneId,
        participantTwoId: conversations.participantTwoId,
        createdAt: conversations.createdAt,
        updatedAt: conversations.updatedAt,
        displayName: users.displayName,
        profileImage: profiles.profileImage,
      })
      .from(conversations)
      .where(
        or(
          eq(conversations.participantOneId, ctx.userId),
          eq(conversations.participantTwoId, ctx.userId),
        ),
      )
      .leftJoin(
        users,
        or(
          and(
            eq(conversations.participantTwoId, users.id),
            ne(users.id, ctx.userId),
          ),
          and(
            eq(conversations.participantOneId, users.id),
            ne(users.id, ctx.userId),
          ),
        ),
      )
      .leftJoin(
        profiles,
        or(
          and(
            eq(conversations.participantTwoId, profiles.userId),
            ne(profiles.userId, ctx.userId),
          ),
          and(
            eq(conversations.participantOneId, profiles.userId),
            ne(profiles.userId, ctx.userId),
          ),
        ),
      );
    // .findMany({
    //   where: (conversation, { eq, or }) =>
    //     or(
    //       eq(conversation.participantOneId, ctx.userId),
    //       eq(conversation.participantTwoId, ctx.userId),
    //     ),
    // });

    logger.info("conversation is", conversation);
    return conversation;
  }),

  getMessageList: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ ctx, input }) => {
      const messageList = await db.query.messages.findMany({
        where: (messages, { eq }) =>
          eq(messages.conversationId, input.conversationId),
      });
      return messageList;
    }),
});
