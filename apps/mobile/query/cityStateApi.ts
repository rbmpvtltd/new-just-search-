import { getAuthHeader } from "@/constants/authHeader";
import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

export const fetchCityState = async () => {
  const response = await api(
    methods.get,
    `${apiUrl}/api/city-state`,
    {},
    { headers: getAuthHeader() },
  );

  return response;
};
export const useCityState = () => {
  return useSuspenseQuery({
    queryKey: ["cityState"],
    queryFn: fetchCityState,
  });
};
