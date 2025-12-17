// features/banners/banners.admin.routes.ts

import crypto from "node:crypto";
import { db } from "@repo/db";
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
import {
  cloudinaryDeleteImageByPublicId,
  cloudinaryDeleteImagesByPublicIds,
} from "@/lib/cloudinary";
import { razorpayInstance } from "@/lib/razorpay";
import { adminProcedure, protectedProcedure, router } from "@/utils/trpc";

export const subscriptionRouter = router({
  create: protectedProcedure
    .input(z.object({ identifier: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const data = await db.query.plans.findFirst({
        where: eq(plans.identifier, input.identifier),
      });
      if (!data) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Plan not found",
        });
      }
      const response = await razorpayInstance.subscriptions.create({
        plan_id: data.identifier,
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
        expiryDate: response.expire_by || 0,
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

      return { success: true, message: "Subscription verified successfully" };
    }),
  revanuePaymentVerification: protectedProcedure
    .input(
      z.object({
        revanue_id: customerInfo.originalAppUserId,
        transaction: transaction.transactionIdentifier,
        plan_id: plan_id,
        product_identifier: productIdentifier,
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
        .where(
          eq(
            planUserSubscriptions.subscriptionNumber,
            input.razorpay_subscription_id,
          ),
        );

      await db.insert(planUserActive).values({
        userId: ctx.userId,
        planId: subscription.plansId,
        features: subscription.features,
      });

      return { success: true, message: "Subscription verified successfully" };
    }),

  edit: adminProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const data = await db
        .select()
        .from(banners)
        .where(eq(banners.id, input.id));
      return data[0];
    }),
  update: adminProcedure
    .input(bannerUpdateSchema)
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      logger.info("getting in backend");
      if (!id)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please pass id field",
        });
      const olddata = (
        await db.select().from(banners).where(eq(banners.id, id))
      )[0];
      if (olddata?.photo && olddata?.photo !== updateData.photo) {
        await cloudinaryDeleteImageByPublicId(olddata.photo);
      }
      await db.update(banners).set(updateData).where(eq(banners.id, id));
      return { success: true };
    }),
  multidelete: adminProcedure
    .input(
      z.object({
        ids: z.array(z.number()),
      }),
    )
    .mutation(async ({ input }) => {
      const allSeletedPhoto = await db
        .select({
          photo: banners.photo,
        })
        .from(banners)
        .where(inArray(banners.id, input.ids));
      await cloudinaryDeleteImagesByPublicIds(
        allSeletedPhoto.map((item) => item.photo),
      );
      await db.delete(banners).where(inArray(banners.id, input.ids));
      return { success: true };
    }),
  multiactive: adminProcedure
    .input(
      z.array(
        z.object({
          id: z.number(),
          isActive: z.boolean(),
        }),
      ),
    )
    .mutation(async ({ input }) => {
      await db
        .update(banners)
        .set({
          isActive: sql`CASE ${banners.id} 
            ${sql.join(
              input.map(
                (item) =>
                  sql`WHEN ${item.id} THEN ${item.isActive ? sql`true` : sql`false`}`,
              ),
              sql` `,
            )} 
                ELSE ${banners.isActive} 
                END`,
        })
        .where(
          inArray(
            banners.id,
            input.map((item) => item.id),
          ),
        );

      return { success: true };
    }),
});
