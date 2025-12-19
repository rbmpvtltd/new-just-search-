import { db } from "@repo/db";
import {
  planAttributes,
  plans,
  planUserActive,
} from "@repo/db/dist/schema/plan.schema";
import { logger } from "@repo/logger";
import { eq, sql } from "drizzle-orm";
import z from "zod";
import { protectedProcedure, router } from "@/utils/trpc";

z.object({
  name: z.string(),
  amount: z.number(),
  currency: z.string().default("INR"),
  description: z.string(),
  interval: z.number(),
  // period: z.enum(PlanPeriod),
});
export const planRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const allPlan = await db
      .select({
        id: plans.id,
        title: plans.name,
        attribute: sql<{ name: string; isAvailable: boolean }[]>`
      COALESCE(
        json_agg(
          json_build_object(
            'name', ${planAttributes.name},
            'isAvailable', ${planAttributes.isAvailable}
          )
        ) FILTER (WHERE ${planAttributes.id} IS NOT NULL),
        '[]'
      )
    `,
        role: plans.role,
        amount: plans.amount,
        currency: plans.currency,
        planColor: plans.planColor,
        status: plans.status,
        features: plans.features,
        identifier: plans.razorPayIdentifier,
        createdAt: plans.createdAt,
        updatedAt: plans.updatedAt,
      })
      .from(plans)
      .leftJoin(planAttributes, eq(plans.id, planAttributes.planId))
      .groupBy(plans.id);

    const freePlan = allPlan.filter((item) => item.role === "all")[0];
    logger.info("freePlan", { freePlan: freePlan });
    if (!freePlan) {
      throw new Error("Free plan not found");
    }
    const isActivePlanExist = (
      await db
        .select()
        .from(planUserActive)
        .where(eq(planUserActive.userId, ctx.userId))
        .limit(1)
    )[0];

    const activePlan = isActivePlanExist
      ? allPlan.find((item) => item.id === isActivePlanExist.planId)
      : freePlan;
    if (!activePlan) {
      throw new Error("Active plan not found");
    }

    logger.info("allPlan", allPlan);
    return {
      plans: allPlan,
      activePlan: {
        planid: activePlan.id,
        isactive: activePlan.id !== freePlan.id,
      },
    };
  }),
});
