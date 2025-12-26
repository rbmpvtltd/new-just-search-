import { protectedProcedure, publicProcedure, router } from "@/utils/trpc";
import { db } from "@repo/db";
import {
  pushTokenInsertSchema,
  pushTokens,
} from "@repo/db/dist/schema/notification.schema";
import { TRPCError } from "@trpc/server";

export const notificationRouter = router({
  createPushToken: protectedProcedure
    .input(pushTokenInsertSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const userId = ctx.userId;
        const { token, deviceId, platform } = input;

        console.log("Attempting to insert push token:", {
          userId,
          token,
          deviceId,
          platform,
        });

        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User ID not found in context",
          });
        }

        const result = await db
          .insert(pushTokens)
          .values({
            userId: userId,
            token: token,
            deviceId: deviceId,
            platform: platform,
          })
          .onConflictDoUpdate({
            target: [pushTokens.deviceId],
            set: {
              token,
              lastActiveAt: new Date(),
            },
          })
          .returning();

        console.log("Push token is  saved successfully:", result);

        return {
          success: true,
          data: result[0],
        };
      } catch (error) {
        console.error("Error saving push token:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to save push token",
          cause: error,
        });
      }
    }),
});
