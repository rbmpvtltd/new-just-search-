// features/banners/banners.admin.routes.ts

import crypto from "node:crypto";
import { on } from "node:events";
import { db } from "@repo/db";
import { users } from "@repo/db/dist/schema/auth.schema";
import {
  banners,
  bannerUpdateSchema,
} from "@repo/db/dist/schema/not-related.schema";
import {
  plans,
  planUserActive,
  planUserSubscriptions,
} from "@repo/db/dist/schema/plan.schema";
import { logger } from "@repo/logger";
import { TRPCError } from "@trpc/server";
import { eq, inArray, sql } from "drizzle-orm";
import z from "zod";
import { subcriptionEventEmit } from "@/dashboard-features/plan/webhooks/revenue-cat.routes";
import {
  cloudinaryDeleteImageByPublicId,
  cloudinaryDeleteImagesByPublicIds,
} from "@/lib/cloudinary";
import { razorpayInstance } from "@/lib/razorpay";
import { adminProcedure, protectedProcedure, router } from "@/utils/trpc";
import { changeRoleInSession } from "../auth/lib/session";
export const subscriptionRouter = router({
  verifyPayment: protectedProcedure
    .input(
      z.object({
        planId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const currentPlan = await db.query.planUserActive.findFirst({
        where: eq(planUserActive.userId, ctx.userId),
      });

      if (currentPlan?.planId === input.planId) {
        const plan = await db.query.plans.findFirst({
          where: eq(plans.id, input.planId),
        });
        await changeRoleInSession(ctx.sessionId, plan?.role || "visitor");

        return {
          success: true,
          role: plan?.role || "visitor",
        };
      }
      return {
        success: false,
      };
    }),
  create: protectedProcedure
    .input(z.object({ identifier: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const data = await db.query.plans.findFirst({
        where: eq(plans.razorPayIdentifier, input.identifier),
      });
      if (!data) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Plan not found",
        });
      }
      const response = await razorpayInstance.subscriptions.create({
        plan_id: data.razorPayIdentifier,
        customer_notify: 1,
        total_count: 1,
        // customer_id: userId,
      });
      console.log(response);

      await db.insert(planUserSubscriptions).values({
        amount: data?.amount || 0,
        subscriptionNumber: response.id,
        transactionNumber: "",
        planIdentifier: input.identifier,
        plansId: data.id,
        userId: ctx.userId,
        currency: data?.currency || "INR",
        features: data?.features,
        expiryDate: BigInt(response.expire_by || 0),
        status: false,
      });
      return { success: true, response: response };
    }),

  verifySubscription: protectedProcedure
    .input(
      z.object({
        razorpay_payment_id: z.string(),
        razorpay_signature: z.string(),
        razorpay_subscription_id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const {
        razorpay_payment_id,
        razorpay_signature,
        razorpay_subscription_id,
      } = input;
      const subscription = await db.query.planUserSubscriptions.findFirst({
        where: eq(
          planUserSubscriptions.subscriptionNumber,
          input.razorpay_subscription_id,
        ),
      });
      if (!subscription) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subscription not found",
        });
      }
      const sign = `${razorpay_payment_id}|${razorpay_subscription_id}`;
      const generated_signature = crypto
        .createHmac("sha256", String(process.env.RAZOR_PAY_KEY_SECRET))
        .update(sign)
        .digest("hex");

      const isValid = generated_signature === razorpay_signature;

      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid signature",
        });
      }
      await db
        .update(planUserSubscriptions)
        .set({
          status: true,
          transactionNumber: razorpay_payment_id,
        })
        .where(eq(planUserSubscriptions.id, subscription.id));

      const activePlan = await db.query.planUserActive.findFirst({
        where: eq(planUserActive.userId, ctx.userId),
      });
      if (!activePlan) {
        await db.insert(planUserActive).values({
          userId: ctx.userId,
          planId: subscription.plansId,
          features: subscription.features,
        });
      } else {
        await db
          .update(planUserActive)
          .set({
            planId: subscription.plansId,
            features: subscription.features,
          })
          .where(eq(planUserActive.userId, ctx.userId));
      }
      const plan = await db.query.plans.findFirst({
        where: eq(plans.id, subscription.plansId),
      });
      await db
        .update(users)
        .set({ role: plan?.role })
        .where(eq(users.id, ctx.userId));

      await changeRoleInSession(ctx.sessionId, plan?.role || "visitor");
      return { success: true, message: "Subscription verified successfully" };
    }),
});
