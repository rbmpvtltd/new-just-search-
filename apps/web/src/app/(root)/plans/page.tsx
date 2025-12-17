import React from "react";
import Plans from "@/features/plan/Plans";
import PricingCard from "@/features/plan/Plans";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";

// plans.js
export default async function page() {
  const { data } = await asyncHandler(trpcServer.planRouter.list.query());
  console.log("data", data);

  return (
    <div className="flex flex-wrap justify-center">
      {data?.plans.map((plan) => (
        <PricingCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}
