import { CheckCircle, XCircle } from "lucide-react";
import type { OutputTrpcType, UnwrapArray } from "@/trpc/type";
import { getRole } from "@/utils/session";
import PaymentButton from "./components/PaymentButton";

type PlanArray = OutputTrpcType["planRouter"]["list"]["plans"];
type ActivePlan = OutputTrpcType["planRouter"]["list"]["activePlan"];
type Plan = UnwrapArray<PlanArray>;

export default async function PricingCard({
  plan,
  activePlan,
}: {
  plan: Plan;
  activePlan: ActivePlan;
}) {
  const currentRole = await getRole();
  console.log("currentRole", currentRole);
  const showBtn = currentRole === plan.role || currentRole === "visiter";
  console.log("showBtn", showBtn);
  const buttonDisable =
    (!showBtn && activePlan.isactive) || plan.role === "all";
  console.log("buttonDisable", buttonDisable);
  console.log("Plan", plan);

  return (
    <div
      className="
        rounded-3xl bg-white
        shadow-md hover:shadow-lg transition-shadow
        m-4 overflow-hidden
        w-full max-w-sm
        flex flex-col
      "
    >
      {/* Header */}
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

        {plan.id === activePlan.planid && (
          <span className="absolute top-2 right-4 bg-accent text-secondary rounded-full px-3 py-1 text-xs font-bold">
            ACTIVE
          </span>
        )}
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

      {/* Action */}
      <div className="border-t px-5 pb-5 pt-4 mt-auto">
        <PaymentButton
          disabled={plan.id === activePlan.planid || buttonDisable}
          identifier={plan.identifier}
          className="
            w-full rounded-full py-3
            font-semibold text-lg
            transition
            text-secondary
            disabled:text-gray-400
          "
          style={{
            backgroundColor:
              plan.id === activePlan.planid
                ? "#E5E7EB"
                : (plan.planColor ?? "#CBD5E1"),
          }}
          title={
            plan.id === activePlan.planid ? "Current Plan" : `Get ${plan.title}`
          }
        />
      </div>
    </div>
  );
}
