import { api, methods } from "@/lib/api";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getAuthHeader } from "@/constants/authHeader";
import { apiUrl } from "@/constants/Variable";
import { cryptoNameList } from "../example";

export interface pricingPlanInterface {
  data: [string];
}

export const pricingPlanList: () => Promise<pricingPlanInterface> =
  async () => {
    const headers = getAuthHeader();
    const response = await api(
      methods.get,
      `${apiUrl}/api/listing`,
      {},
      {
        headers: getAuthHeader(),
      },
    );
    return response;
  };

export const useBusinessList = () => {
  return useSuspenseQuery({
    queryKey: ["myBusinessList"],
    queryFn: async (): Promise<any> => {},
  });
};

export const useCryptoNameList = () => {
  return useQuery({
    queryKey: ["cryptoNameList"],
    queryFn: async () => await cryptoNameList(),
  });
};
