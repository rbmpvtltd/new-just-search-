import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import PricingPlansComponent from "@/features/plan/pricing.component";

export default function pricingPlans() {
  console.log("hello");
  return (
    <BoundaryWrapper>
      <PricingPlansComponent />
    </BoundaryWrapper>
  );
}
