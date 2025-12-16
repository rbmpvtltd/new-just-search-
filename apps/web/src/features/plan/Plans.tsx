import { CheckCircle, XCircle } from "lucide-react";
import type { OutputTrpcType, UnwrapArray } from "@/trpc/type";
import PaymentButton from "./components/PaymentButton";

type PlanArray = OutputTrpcType["planRouter"]["list"];
type Plan = UnwrapArray<PlanArray>;

export default function PricingCard({ plan }: { plan: Plan }) {
  return (
    <div className=" rounded-3xl shadow-lg m-4 overflow-hidden w-full max-w-sm">
      <div className={`{py-5 rounded-t-3xl text-center relative} `}>
        <h2 className="text-2xl font-bold text-secondary">{plan?.title}</h2>

        {plan.status && (
          <span className="absolute top-2 right-4 bg-accent rounded-full px-3 py-1 text-xs font-bold ">
            ACTIVE
          </span>
        )}
      </div>

      {/* Price */}
      <div className="py-5 text-center border-b">
        <p className="text-3xl font-bold text-secondary">
          ₹{plan.amount} {plan?.amount > 0 && "+ GST / year"}
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
          disabled={!!plan.status}
          identifier={plan.identifier}
          className={`w-full rounded-full py-3 font-semibold text-lg text-secondary transition
            ${plan.status ? "cursor-not-allowed" : "hover:opacity-90"}`}
          style={{
            backgroundColor: plan.status
              ? "#E5E7EB"
              : (plan.planColor ?? "#CBD5E1"),
          }}
          title={plan.status ? "Current Plan" : `Get ${plan.title}`}
        />
      </div>
    </div>
  );
}
