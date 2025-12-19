import { plans } from "@repo/db/dist/schema/plan.schema";
import axios from "axios";
import env from "@/utils/envaild";

export const planColumns = {
  id: plans.id,
  amount: plans.amount,
  role: plans.role,
};

export const planGlobalFilterColumns = [plans.name];
export const planAllowedSortColumns = ["id", "name", "role", "amount"];

export const verifySubscriptionApiRevenueCat = async (
  subscription_id: string,
) => {
  return await axios.get(
    `https://api.revenuecat.com/v2/projects/${env.REVENUE_CAT_PROJECT_ID}/subscriptions/${subscription_id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${env.REVENUE_CAT_SECRET}`,
      },
    },
  );
};
