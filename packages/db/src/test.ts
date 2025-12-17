import { eq, sql } from "drizzle-orm";
import { db } from ".";
import { planAttributes, plans, planUserActive } from "./schema/plan.schema";

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
    identifier: plans.identifier,
    createdAt: plans.createdAt,
    updatedAt: plans.updatedAt,
  })
  .from(plans)
  .leftJoin(planAttributes, eq(plans.id, planAttributes.planId))
  .groupBy(plans.id);

const freePlan = allPlan.filter((item) => item.role === "business")[0];
if (!freePlan) {
  throw new Error("Free plan not found");
}
const isActivePlanExist = (
  await db
    .select()
    .from(planUserActive)
    .where(eq(planUserActive.userId, 7))
    .limit(1)
)[0];

const activePlan = isActivePlanExist
  ? allPlan.find((item) => item.id === isActivePlanExist.planId)
  : freePlan;
if (!activePlan) {
  throw new Error("Active plan not found");
}

console.log("allPlan", {
  plans: allPlan,
  activePlan: {
    planid: activePlan.id,
    isactive: activePlan.id !== freePlan.id,
  },
});
