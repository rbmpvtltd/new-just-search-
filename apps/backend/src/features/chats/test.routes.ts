import { publicProcedure, router } from "@/utils/trpc";
import { tracked } from "@trpc/server";
import { EventEmitter,on } from "events";
import z from "zod";

const ee = new EventEmitter();


export const chatRouter = router({
    onPostAdd: publicProcedure
    .input(
      z
        .object({
          // lastEventId is the last event id that the client has received
          // On the first call, it will be whatever was passed in the initial setup
          // If the client reconnects, it will be the last event id that the client received
          // from : z.string(),
          // to:z.string(),
          lastEventId: z.string().nullish().optional(),
        })
    )
    .subscription(async function* (opts) {
      if (opts?.input?.lastEventId) {
        // [...] get the posts since the last event id and yield them
      }
      for await (const [data] of on(ee, "send", {signal: opts.signal,})) {
        const payload = data;
        console.log("data in server from websocket is ==========>",data)
        // tracking the post id ensures the client can reconnect at any time and get the latest events this id
        yield tracked(payload.id, payload);
      }
    }),
    sendPost : publicProcedure.input(z.object({
        content : z.string(),
        author : z.string()
    })).mutation(async ({input})=>{
        const newPost = {
            id : Date.now().toString(),
            author : input.author,
            content : input.content,
        }

        ee.emit("send",{
            id : newPost.id,
            author : newPost.author,
            content : newPost.content,
            timestamp : new Date().toISOString(),
        })

        console.log("Post sent ============>",newPost)

        return newPost
    })
})

