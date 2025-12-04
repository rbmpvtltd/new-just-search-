import { EventEmitter, on } from "node:events";
import { db, schemas } from "@repo/db";
import { chatImages, chatSessions } from "@repo/db/dist/schema/chat.schema";
import { users } from "@repo/db/dist/schema/auth.schema";
import { profiles } from "@repo/db/dist/schema/user.schema";
import { logger } from "@repo/logger";
import { TRPCError, tracked } from "@trpc/server";
import { and, desc, eq, inArray, ne, or, sql } from "drizzle-orm";
import z from "zod";
import { protectedProcedure, router } from "@/utils/trpc";

const chatMessages = schemas.chat.chatMessages;

const ee = new EventEmitter();
export const chatRouter = router({
  onMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.number(),
        lastMessageId: z.number().optional(),
      }),
    )
    .subscription(async function* ({ input }) {
      logger.info("input is from onMessage", { input: input });

      // if (input.lastMessageId) {
      //   const oldMessages = await db.query.chatMessages.findMany({
      //     where: (chatMessages, { gt, eq }) =>
      //       eq(chatMessages.chatSessionId, input.conversationId) &&
      //       gt(chatMessages.id, Number(input.lastMessageId)),
      //   });
      //   for (const msg of oldMessages) {
      //     yield tracked(String(msg.id), msg);
      //   }
      // }

      // if (input.messageId) {
      //   const lastMessage = await db.query.messages.findMany({
      //     where: (messages, { gt }) => gt(messages.id, Number(input.messageId)),
      //   });

      //   for (const msg of lastMessage) {
      //     yield tracked(String(msg?.id), msg);
      //   }
      // }
      for await (const [msg] of on(ee, `message${input.conversationId}`)) {
        logger.info("msg is from onMessage", { msg: msg });
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
        .insert(schemas.chat.chatMessages)
        .values({
          chatSessionId: Number(input.conversationId),
          senderId: ctx.userId,
          message: input.message,
        })
        .returning();
      logger.info("newMessage is", { newMessage: newMessage });
      if ((input.route || input.image) && newMessage) {
        const [newProduct] = await db
          .insert(schemas.chat.chatImages)
          .values({
            image: input.image || "",
            chatMessageId: newMessage.id,
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
      const isConversationExists = await db.query.chatSessions.findFirst({
        where: (chatSessions, { or, eq, and }) =>
          or(
            and(
              eq(chatSessions.participantOneId, ctx.userId),
              eq(chatSessions.participantTwoId, business?.userId),
            ),
            and(
              eq(chatSessions.participantOneId, business?.userId),
              eq(chatSessions.participantTwoId, ctx.userId),
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
        .insert(schemas.chat.chatSessions)
        .values({
          participantOneId: ctx.userId,
          participantTwoId: user.id,
        })
        .returning();
      return newConversation[0];
    }),

  conversationList: protectedProcedure.query(async ({ ctx, input }) => {
    const subQuery = db
      .select({})
      .from(chatMessages)
      .where(eq(chatMessages.senderId, ctx.userId));

    const conversation = await db
      .selectDistinct({
        id: chatSessions.id,
        participantOneId: chatSessions.participantOneId,
        participantTwoId: chatSessions.participantTwoId,
        createdAt: chatSessions.createdAt,
        updatedAt: chatSessions.updatedAt,
        displayName: users.displayName,
        profileImage: profiles.profileImage,
        // isRead: chatMessages.isRead,
        // lastMessage: sql<string>`MAX(${chatMessages.message})`.as(
        //   "lastMessage",
        // ),
        // ... (rest of the code before lastMessage)

        lastMessage: sql<string>`(${db
          .select({ msg: chatMessages.message })
          .from(chatMessages)
          .where(eq(chatMessages.chatSessionId, chatSessions.id))
          .orderBy(desc(chatMessages.createdAt))
          .limit(1)})`.as("lastMessage"),

        unreadCount: sql<number>`COUNT(${chatMessages.id})`.as("unreadCount"),
        // ... (rest of the code after lastMessage)
      })
      .from(chatSessions)
      .where(
        or(
          eq(chatSessions.participantOneId, ctx.userId),
          eq(chatSessions.participantTwoId, ctx.userId),
        ),
      )
      .leftJoin(
        users,
        or(
          and(
            eq(chatSessions.participantTwoId, users.id),
            ne(users.id, ctx.userId),
          ),
          and(
            eq(chatSessions.participantOneId, users.id),
            ne(users.id, ctx.userId),
          ),
        ),
      )
      .leftJoin(profiles, and(eq(users.id, profiles.userId)))
      .leftJoin(
        chatMessages,
        and(
          eq(chatSessions.id, chatMessages.chatSessionId),
          eq(chatMessages.isRead, false),
          ne(chatMessages.senderId, ctx.userId),
        ),
      )
      .groupBy(
        chatSessions.id,
        chatSessions.participantOneId,
        chatSessions.participantTwoId,
        chatSessions.createdAt,
        chatSessions.updatedAt,
        users.displayName,
        profiles.profileImage,
      )
      .orderBy(chatSessions.id);

    logger.info("conversation is", conversation);
    return conversation;
  }),

  getMessageList: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ ctx, input }) => {
      // const messageList = await db.query.chatMessages.findMany({
      //   where: (messages, { eq }) =>
      //     eq(messages.chatSessionId, input.conversationId),
      //   orderBy: (messages) => [messages.createdAt],
      // });

      const messageList = await db
        .select({
          id: chatMessages.id,
          chatSessionId: chatMessages.chatSessionId,
          senderId: chatMessages.senderId,
          message: chatMessages.message,
          isRead: chatMessages.isRead,
          replyToMessageId: chatMessages.replyToMessageId,
          createdAt: chatMessages.createdAt,
          updatedAt: chatMessages.updatedAt,
          image: chatImages.image,
          route: chatImages.route,
        })
        .from(chatMessages)
        .where(eq(chatMessages.chatSessionId, input.conversationId))
        .leftJoin(chatImages, eq(chatMessages.id, chatImages.chatMessageId))
        .orderBy(chatMessages.id);

      return messageList;
    }),

  getOtherUserDisplayNameAndImage: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ ctx, input }) => {
      const session = await db.query.chatSessions.findFirst({
        where: (chat, { eq, or }) => eq(chat.id, input.conversationId),

        columns: {
          participantOneId: true,
          participantTwoId: true,
        },
      });

      logger.info("session is", { session: session });

      const otherUserId =
        session?.participantOneId === ctx.userId
          ? session.participantTwoId
          : session?.participantOneId;

      // const displayName = await db.query.users.findFirst({
      //   where: (users, { eq }) => eq(users.id, Number(otherUserId)),
      //   columns: {
      //     displayName: true,
      //     // profileImage: true,
      //   },
      //   with: {
      //     profiles: {
      //       columns: {
      //         profileImage: true,
      //       },
      //     },
      //   },
      // });

      const displayName = await db
        .select({
          displayName: users.displayName,
          profileImage: profiles.profileImage,
        })
        .from(users)
        .where(eq(users.id, Number(otherUserId)))
        .leftJoin(profiles, eq(profiles.userId, users.id));

      // const displayName = await db
      //   .select({
      //     displayName: users.displayName,
      //     // profileImage: profiles.profileImage,
      //   })
      //   .from(users)
      //   .where(
      //     or(
      //       and(
      //         eq(users.id, schemas.chat.chatSessions.participantOneId),
      //         ne(users.id, ctx.userId),
      //       ),
      //       and(
      //         eq(users.id, schemas.chat.chatSessions.participantTwoId),
      //         ne(users.id, ctx.userId),
      //       ),
      //     ),
      //   )
      //   .leftJoin(
      //     chatSessions,
      //     and(
      //       eq(users.id, chatSessions.participantOneId),
      //       ne(users.id, ctx.userId),
      //     ),
      //   );

      return displayName;
    }),
  markAsRead: protectedProcedure
    .input(z.object({ messageId: z.array(z.number()) }))
    .mutation(async ({ ctx, input }) => {

      if (input.messageId.length > 0) {
        await db
          .update(schemas.chat.chatMessages)
          .set({
            isRead: true,
          })
          .where(inArray(schemas.chat.chatMessages.id, input.messageId));
      }

      return {
        success: true,
        message: "Message marked as read successfully",
      };
    }),
});
