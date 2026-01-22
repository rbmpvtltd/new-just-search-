export const dynamic = "force-dynamic";

import PricingCard from "@/features/plan/Plans";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";

export default async function page() {
  const { data } = await asyncHandler(trpcServer.planRouter.list.query());

  return (
    <div className="flex flex-wrap justify-center">
      {data?.plans.map((plan) => (
        <PricingCard key={plan.id} plan={plan} activePlan={data.activePlan} />
      ))}
    </div>
  );
}
