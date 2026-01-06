import { protectedProcedure, publicProcedure, router } from "@/utils/trpc";
import { db } from "@repo/db";
import { users } from "@repo/db/dist/schema/auth.schema";
import { businessCategories, businessListings, businessSubcategories } from "@repo/db/dist/schema/business.schema";
import {
  pushTokenInsertSchema,
  pushTokens,
} from "@repo/db/dist/schema/notification.schema";
import { notification } from "@repo/db/dist/schema/user.schema";
import { TRPCError } from "@trpc/server";
import {and, eq, or} from "drizzle-orm"

export const notificationRouter = router({
  getNotifications : protectedProcedure.query(async({ctx})=>{
    if(ctx.role === "business"){
      const data = await db.select({
        title: notification.title,
        description: notification.description,
        id : notification.id,
        categoryId : businessCategories.categoryId,
        subcategory : businessSubcategories.subcategoryId
      })
      .from(notification)
      .leftJoin(
        businessListings,eq(businessListings.userId,ctx.userId)
      )
      .leftJoin(businessCategories,eq(businessCategories.businessId,businessListings.id))
      .leftJoin(businessSubcategories,eq(businessSubcategories.businessId,businessListings.id))
      .where(or(eq(notification.categoryId,businessCategories.categoryId),eq(notification.subCategoryId,businessSubcategories.subcategoryId)))
      .groupBy(businessCategories.id,notification.id,businessSubcategories.id)
  
      return { success : true,data : data,ctx}
    }
  }),
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
