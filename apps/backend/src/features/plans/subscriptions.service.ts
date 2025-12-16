import { plans } from "@repo/db/dist/schema/plan.schema";

export const planColumns = {
  id: plans.id,
  amount: plans.amount,
  role: plans.role,
};

export const planGlobalFilterColumns = [plans.name];
export const planAllowedSortColumns = ["id", "name", "role", "amount"];
