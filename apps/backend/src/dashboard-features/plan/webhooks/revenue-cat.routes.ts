import EventEmitter from "node:events";
import { db } from "@repo/db";
import {
  planUserActive,
  planUserSubscriptions,
} from "@repo/db/dist/schema/plan.schema";
import { logger } from "@repo/logger";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import env from "@/utils/envaild";
import type { RevenueCatWebhookEvent } from "./types";

const ee = new EventEmitter();
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
            eq(plans.revenueCatIdentifier, String(event.presented_offering_id)),
        });

        const user = await db.query.users.findFirst({
          where: (users, { eq }) =>
            eq(users.revanueCatId, String(event.app_user_id)),
        });

        if (!plan || !user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Plan not found",
          });
        }
        await db.insert(planUserSubscriptions).values({
          amount: event?.price_in_purchased_currency || 0,
          subscriptionNumber: event?.id,
          transactionNumber: event?.transaction_id,
          planIdentifier: event.presented_offering_id,
          plansId: plan.id,
          userId: user.id,
          currency: event?.currency || "INR",
          features: plan?.features,
          expiryDate: event.expiration_at_ms || 0,
          status: true,
        });

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

        ee.emit(`subscription${user.id}`, "subscription created successfully");
        break;
      }
      case "EXPIRATION":
        // Logic for removing access
        break;
      default:
        console.log("Unhandled event type:", event.type);
    }

    logger.info("revenueCatRouter", { body: body });
    return res.send("revenueCatRouter");
  },
);
