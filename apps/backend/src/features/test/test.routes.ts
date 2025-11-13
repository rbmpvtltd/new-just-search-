import { EventEmitter, on } from "node:events";
import { db, schemas } from "@repo/db";
import { conversations, messages } from "@repo/db/dist/schema/chat.schema";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { publicProcedure, router, visitorProcedure } from "@/utils/trpc";

const ee = new EventEmitter();
export const testRouter = router({
  onMessage: visitorProcedure
    .input(z.object({ userId: z.string() }))
    .subscription(async function* ({ input }) {
      for await (const [msg] of on(ee, `message${input.userId}`)) {
        yield msg;
      }
    }),

  sendMessage: visitorProcedure
    .input(
      z.object({
        userId: z.string(),
        message: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await db.query.users.findFirst({
        where: (user, { eq }) => eq(user.id, ctx.userId),
      });

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });
      }
      // check if conversation aleary exists

      let conversation = await db.query.conversations.findFirst({
        where: (conversations, { or, and, eq }) =>
          or(
            and(
              eq(conversations.participantOneId, ctx.userId),
              eq(conversations.participantTwoId, Number(input.userId)),
            ),
            and(
              eq(conversations.participantOneId, Number(input.userId)),
              eq(conversations.participantTwoId, ctx.userId),
            ),
          ),
      });
      if (!conversation) {
        const inserted = await db
          .insert(schemas.chat.conversations)
          .values({
            participantOneId: user.id ?? 1,
            participantTwoId: Number(input.userId) ?? 1,
          })
          .returning({ id: schemas.chat.conversations.id });

        conversation = inserted[0];
      }
      const [newMessage] = await db
        .insert(schemas.chat.messages)
        .values({
          conversationId: conversation?.id,
          senderId: ctx.userId,
          message: input.message,
        })
        .returning();
      ee.emit(`message${input.userId}`, { text: newMessage }); //receiver
      ee.emit(`message${user.id}`, { text: newMessage }); //sender
      return {
        success: true,
        message: "Message sent successfully",
        data: conversation,
      };
    }),

  conversationList: visitorProcedure.query(async ({ ctx }) => {
    const conversations = await db.query.conversations.findMany({
      where: (conversation, { eq }) =>
        eq(conversation.participantOneId, ctx.userId) ||
        eq(conversation.participantTwoId, ctx.userId),
    });
    return conversations;
  }),

  getMessageList: visitorProcedure.query(async({ctx, input})=>{
    
  })
});
