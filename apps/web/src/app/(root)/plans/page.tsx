import React from "react";
import Plans from "@/features/plan/Plans";
import PricingCard from "@/features/plan/Plans";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";

// plans.js
export const plans = [
  {
    id: 1,
    title: "Free",
    price: 0,
    active: true,
    price_color: "#E5E7EB",
    attributes: ["BUSINESS LISTING", "LIMITED SUPPORT"],
  },
  {
    id: 2,
    title: "Starter",
    price: 999,
    active: false,
    price_color: "#F97316",
    attributes: ["BUSINESS LISTING", "PRIORITY SUPPORT", "CUSTOMER CHAT"],
  },
  {
    id: 3,
    title: "Pro",
    price: 1999,
    active: false,
    price_color: "#10B981",
    attributes: [
      "BUSINESS LISTING",
      "PRIORITY SUPPORT",
      "CUSTOMER CHAT",
      "ANALYTICS",
    ],
  },
];

export default async function page() {
  const { data } = await asyncHandler(trpcServer.planRouter.list.query());


  return (
    <div className="flex flex-wrap justify-center">
      {data?.map((plan) => (
        <PricingCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}
