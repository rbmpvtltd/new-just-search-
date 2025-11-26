import { logger } from "@repo/logger";
import { tracked } from "@trpc/server";
import { EventEmitter, on } from "events";
import z from "zod";
import { protectedProcedure, publicProcedure, router } from "@/utils/trpc";

const ee = new EventEmitter();

export const testRouter = router({
  onPostAdd: publicProcedure
    .input(
      z.object({
        // lastEventId is the last event id that the client has received
        // On the first call, it will be whatever was passed in the initial setup
        // If the client reconnects, it will be the last event id that the client received
        // from : z.string(),
        // to:z.string(),
        lastEventId: z.string().nullish().optional(),
      }),
    )
    .subscription(async function* (opts) {
      if (opts?.input?.lastEventId) {
        // [...] get the posts since the last event id and yield them
      }
      for await (const [data] of on(ee, "send", { signal: opts.signal })) {
        const payload = data;
        console.log("data in server from websocket is ==========>", data);
        // tracking the post id ensures the client can reconnect at any time and get the latest events this id
        yield tracked(payload.id, payload);
      }
    }),
  sendPost: publicProcedure
    .input(
      z.object({
        content: z.string(),
        author: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const newPost = {
        id: Date.now().toString(),
        author: input.author,
        content: input.content,
      };

      ee.emit("send", {
        id: newPost.id,
        author: newPost.author,
        content: newPost.content,
        timestamp: new Date().toISOString(),
      });

      console.log("Post sent ============>", newPost);

      return newPost;
    }),

  onMessage: protectedProcedure
  .input(z.object({}))
  .subscription(async function* () {
    logger.info("Client subscribed to onMessage");

    // Send message every 5 seconds
    const interval = setInterval(() => {
      ee.emit("message", `Hello every 5 seconds: ${Date.now()}`);
    }, 5000);

    try {
      for await (const [msg] of on(ee, "message")) {
        logger.info("Emitted message:", msg);
        yield msg;
      }
    } finally {
      clearInterval(interval);
      logger.info("Client unsubscribed from onMessage");
    }
  }),

  sendMessage: protectedProcedure.mutation(async ({ ctx, input }) => {
    logger.info("input is", { input: input });

    ee.emit("message", "Hello from test chat"); //receiver
    // ee.emit(`message${user.id}`, { text: newMessage }); //sender
    return {
      success: true,
      message: "Message sent successfully",
    };
  }),
});
