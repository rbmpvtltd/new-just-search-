import { protectedProcedure, publicProcedure, router } from "@/utils/trpc";
import { db } from "@repo/db";
import {
  pushTokenInsertSchema,
  pushTokens,
} from "@repo/db/dist/schema/notification.schema";

export const notificationRouter = router({
  getNotification: protectedProcedure.query(async ({ ctx }) => {
    return { success: true, data: ctx };
  }),
  createPushToken: protectedProcedure
    .input(pushTokenInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.userId;
      const { token, deviceId, platform } = input;

      await db
        .insert(pushTokens)
        .values({
          userId,
          token,
          deviceId,
          platform,
        })
        .onConflictDoUpdate({
          target: [pushTokens.deviceId],
          set: {
            token,
            lastActiveAt: new Date(),
          },
        });
    }),
});
