import { protectedProcedure, publicProcedure, router } from "@/utils/trpc";
import { db } from "@repo/db";
import { users } from "@repo/db/dist/schema/auth.schema";
import {
  businessCategories,
  businessListings,
  businessSubcategories,
} from "@repo/db/dist/schema/business.schema";
import {
  pushTokenInsertSchema,
  pushTokens,
} from "@repo/db/dist/schema/notification.schema";
import { notification } from "@repo/db/dist/schema/user.schema";
import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, inArray, isNotNull, isNull, or } from "drizzle-orm";

export const notificationRouter = router({
  getNotifications: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.role === "business") {
      // Get business listings
      const listings = await db
        .select({
          id: businessListings.id,
          city: businessListings.city,
          state: businessListings.state,
          name: businessListings.name,
        })
        .from(businessListings)
        .where(eq(businessListings.userId, ctx.userId));

      if (listings.length === 0) {
        return {
          success: true,
          data: [],
        };
      }

      const listingIds = listings.map((l) => l.id);

      // Get categories for these listings
      const categories = await db
        .select()
        .from(businessCategories)
        .where(inArray(businessCategories.businessId, listingIds));

      // Get subcategories for these listings
      const subcategories = await db
        .select()
        .from(businessSubcategories)
        .where(inArray(businessSubcategories.businessId, listingIds));

      const categoryIds = categories.map((c) => c.categoryId);
      const subcategoryIds = subcategories.map((s) => s.subcategoryId);
      const cities = [...new Set(listings.map((l) => l.city))];
      const states = [...new Set(listings.map((l) => l.state))];
      // Fetch notifications with matching criteria
      const notifications = await db
        .select({
          id: notification.notificationId,
          title: notification.title,
          description: notification.description,
          createdAt : notification.createdAt
        })
        .from(notification)
        .where(
          and(
            eq(notification.role, "business"),
            or(
              // Category match: notification has category AND it matches business category
              // OR notification has no category (null)
              and(
                isNotNull(notification.categoryId),
                inArray(
                  notification.categoryId,
                  categoryIds.length > 0 ? categoryIds : [0],
                ),
              ),
              isNull(notification.categoryId),
            ),
            or(
              // Subcategory match: notification has subcategory AND it matches business subcategory
              // OR notification has no subcategory (null)
              and(
                isNotNull(notification.subCategoryId),
                inArray(
                  notification.subCategoryId,
                  subcategoryIds.length > 0 ? subcategoryIds : [0],
                ),
              ),
              isNull(notification.subCategoryId),
            ),
            or(
              // State match: notification has state AND it matches business state
              // OR notification has no state (null)
              and(
                isNotNull(notification.state),
                inArray(notification.state, states),
              ),
              isNull(notification.state),
            ),
            or(
              // City match: notification has city AND it matches business city
              // OR notification has no city (null)
              and(
                isNotNull(notification.city),
                inArray(notification.city, cities),
              ),
              isNull(notification.city),
            ),
          ),
        )
        .groupBy(
          notification.notificationId,
          notification.title,
          notification.description,
          notification.createdAt
        )
      .orderBy(desc(notification.createdAt)); // Most recent first

      return {
        success: true,
        data: notifications,
      };
    }

    // For non-business users
    return {
      success: true,
      data: [],
    };
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
