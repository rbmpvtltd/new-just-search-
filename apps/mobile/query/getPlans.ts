import { getAuthHeader } from "@/constants/authHeader";
import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

export type PlanInterface = {
  id: number;
  title: "Free" | "Pro" | "Ultra" | "Hire";
  plan_type?: number;
  price: number;
  prev_price?: string;
  attribute?: [];
  price_color?: string;
  post_limit?: number;
  product_limit?: number;
  offer_limit?: number;
  post_duration?: number;
  offer_duration?: number;
  max_offers_per_day?: number;
  active?: boolean;
};

export const fetchAllPlans = async (): Promise<PlanInterface[]> => {
  const response = await api(
    methods.get,
    `${apiUrl}/api/plans`,
    {},
    {
      headers: getAuthHeader(),
    },
  );

  return response.plans;
};

export const useFetchAllPlans = () => {
  return useSuspenseQuery({
    queryKey: ["plans"],
    queryFn: fetchAllPlans,
  });
};
