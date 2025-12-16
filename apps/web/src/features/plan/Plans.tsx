import { CheckCircle, XCircle } from "lucide-react";
import type { OutputTrpcType, UnwrapArray } from "@/trpc/type";
import PaymentButton from "./components/PaymentButton";

type PlanArray = OutputTrpcType["planRouter"]["list"];
type Plan = UnwrapArray<PlanArray>;

export default function PricingCard({ plan }: { plan: Plan }) {
  console.log(plan);

  return (
    <div className="bg-base-200 rounded-3xl shadow-lg m-4 overflow-hidden w-full max-w-sm">
      <div className={`{py-5 rounded-t-3xl text-center relative} `}>
        <h2 className="text-2xl font-bold text-secondary">{plan?.title}</h2>

        {plan.status && (
          <span className="absolute top-2 right-4 bg-accent rounded-full px-3 py-1 text-xs font-bold text-secondary">
            ACTIVE
          </span>
        )}
      </div>

      {/* Price */}
      <div className="py-5 text-center border-b border-base-300">
        <p className="text-3xl font-bold text-secondary">
          ₹{plan.amount} {plan?.amount && plan?.amount > 0 && "+ GST / year"}
        </p>
      </div>

      <div className="p-5 space-y-4">
        {plan.attribute?.map((feature, index) => (
          <div
            key={String(index) + feature.name}
            className="flex items-start gap-3"
          >
            {feature.isAvailable ? (
              <CheckCircle size={22} className="text-green-500 mt-0.5" />
            ) : (
              <XCircle size={22} className="text-red-500 mt-0.5" />
            )}

            <span className="text-secondary flex-1">{feature.name}</span>
          </div>
        ))}
      </div>

      <div className="px-5 pb-5">
        <PaymentButton
          identifier={plan.identifier}
          className={`w-full rounded-full py-3 font-semibold text-lg text-secondary transition
             ${plan.planColor}`}
          style={{
            backgroundColor: plan.planColor ?? "#E5E7EB",
          }}
          title={plan.status ? "Current Plan" : `Get ${plan.title}`}
        />
      </div>
    </div>
  );
}
