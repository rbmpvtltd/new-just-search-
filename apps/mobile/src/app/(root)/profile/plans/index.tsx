import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import { useAuthStore } from "@/features/auth/authStore";
import PricingPlansComponent from "@/features/plan/pricing.component";
import FakePricingPlans from "@/features/pricing-plans/PricingPlans";

export default function pricingPlans() {
  const isAuthenticated = useAuthStore((state) => state.authenticated);
  return (
    <BoundaryWrapper>
      {isAuthenticated ? <PricingPlansComponent /> : <FakePricingPlans />}
    </BoundaryWrapper>
  );
}
