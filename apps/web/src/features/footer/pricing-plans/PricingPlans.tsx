"use client";
import { is } from "date-fns/locale";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingPlan {
  id: number;
  title: string;
  amount: number;
  attribute: { name: string; isAvailable: boolean }[];
  planColor: string;
}
const plans = [
  {
    id: 1,
    title: "FREE",
    amount: 0,
    attribute: [
      { name: "BUSINESS LISTING", isAvailable: true },
      { name: "HIRE PROFILE", isAvailable: true },
      { name: "PRODUCT LISTING", isAvailable: false },
      { name: "OFFER LISTING", isAvailable: false },
      { name: "VERIFICATION BADGE", isAvailable: false },
    ],
    planColor: "#ff3131",
  },
  {
    id: 2,
    title: "PRO",
    amount: 2199,
    attribute: [
      { name: "BUSINESS LISTING", isAvailable: true },
      { name: "VERIFICATION BADGE", isAvailable: true },
      { name: "30 PRODUCTS LISTING", isAvailable: true },
      {
        name: "15 OFFERS LISTING/MONTH(EACH OFFER VALID FOR 3 DAYS)",
        isAvailable: true,
      },
    ],
    planColor: "#ffbd59",
  },
  {
    id: 3,
    title: "ULTRA",
    amount: 2999,
    attribute: [
      { name: "BUSINESS LISTING", isAvailable: true },
      { name: "VERIFICATION BADGE", isAvailable: true },
      { name: "80 PRODUCTS LISTING", isAvailable: true },
      {
        name: "40 OFFERS LISTING/MONTH(EACH OFFER VALID FOR 5 DAYS)",
        isAvailable: true,
      },
    ],
    planColor: "#7ed957",
  },
  {
    id: 4,
    title: "HIRE",
    amount: 399,
    attribute: [
      { name: "HIRE PROFILE", isAvailable: true },
      { name: "VERIFICATION BADGE", isAvailable: true },
    ],
    planColor: "#38b6ff",
  },
];
export default function PricingPlans() {
  return (
    <div className="flex flex-wrap justify-center">
      {plans.map((plan) => (
        <PricingCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}

function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <div className="rounded-3xl bg-white shadow-md hover:shadow-lg transition-shadow m-4 overflow-hidden w-full max-w-sm flex flex-col">
      <div
        className="py-5 rounded-t-3xl text-center relative"
        style={{ backgroundColor: plan.planColor }}
      >
        <h2
          className={`${
            plan?.title === "FREE" ? "text-white" : "text-secondary"
          } text-2xl font-bold`}
        >
          {plan?.title}
        </h2>
      </div>

      <div className="py-5 text-center border-b">
        <p className="text-3xl font-bold text-secondary">
          ₹{plan.amount} {plan?.amount > 0 && "+ GST / year"}
        </p>
      </div>

      <div className="p-5 space-y-3 flex-1">
        {plan.attribute?.map((feature: any, index: number) => (
          <div
            key={`${index}-${feature.name}`}
            className="flex items-start gap-3"
          >
            {feature.isAvailable ? (
              <CheckCircle size={20} className="text-green-500 mt-0.5" />
            ) : (
              <XCircle size={20} className="text-red-500 mt-0.5" />
            )}

            <span className="text-secondary flex-1">{feature.name}</span>
          </div>
        ))}
      </div>

      <div className="border-t px-5 pb-5 pt-4 mt-auto">
        <Button
          className="w-full rounded-full py-3 font-semibold text-lg text-white pointer-events-none"
          style={{
            backgroundColor: plan.planColor,
          }}
        >
          {plan.title === "FREE" ? "Get Started" : "Upgrade Now"}
        </Button>
      </div>
    </div>
  );
}
