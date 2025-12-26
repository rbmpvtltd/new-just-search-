import EventEmitter from "node:events";
import { db } from "@repo/db";
import {
  planUserActive,
  planUserSubscriptions,
} from "@repo/db/dist/schema/plan.schema";
import { TRPCError } from "@trpc/server";
import { eq, type InferInsertModel } from "drizzle-orm";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import env from "@/utils/envaild";
import type { RevenueCatWebhookEvent } from "./types";

export const subcriptionEventEmit = new EventEmitter();
export const asyncHandler =
  (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
  ): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const revenueCatRouter = asyncHandler(
  async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token !== env.REVENUECAT_TOKEN)
      return res.status(401).json({ error: "Unauthorized" });
    const body = req.body as RevenueCatWebhookEvent;
    const { event } = body;

    switch (event.type) {
      case "INITIAL_PURCHASE": {
        const plan = await db.query.plans.findFirst({
          where: (plans, { eq }) =>
            eq(plans.revenueCatIdentifier, String(event.entitlement_ids?.[0])),
        });

        const user = await db.query.users.findFirst({
          where: (users, { eq }) =>
            eq(users.revanueCatId, String(event.app_user_id)),
        });

        if (!plan) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Plan not found",
          });
        }
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        type PlanUserSubscription = InferInsertModel<
          typeof planUserSubscriptions
        >;
        const planUserSubscriptionData: PlanUserSubscription = {
          amount: event?.price_in_purchased_currency || 0,
          subscriptionNumber: event?.id,
          transactionNumber: event?.transaction_id,
          planIdentifier: event?.entitlement_ids?.[0],
          plansId: plan.id,
          userId: user.id,
          currency: event?.currency || "INR",
          features: plan?.features,
          expiryDate: event.expiration_at_ms,
          status: true,
        };

        await db.insert(planUserSubscriptions).values(planUserSubscriptionData);

        const activePlan = await db.query.planUserActive.findFirst({
          where: (planUserActive, { eq }) => eq(planUserActive.userId, user.id),
        });
        if (!activePlan) {
          await db.insert(planUserActive).values({
            userId: user.id,
            planId: plan.id,
            features: plan.features,
          });
        } else {
          await db
            .update(planUserActive)
            .set({
              planId: plan.id,
              features: plan.features,
            })
            .where(eq(planUserActive.userId, user.id));
        }

        // subcriptionEventEmit.emit(
        //   `subscription${user.id}`,
        //   "subscription created successfully",
        // );
        console.log("event subitted successfully");
        break;
      }
      case "EXPIRATION":
        // Logic for removing access
        break;
      default:
        console.log("Unhandled event type:", event.type);
    }

    return res.send("revenueCatRouter");
  },
);
