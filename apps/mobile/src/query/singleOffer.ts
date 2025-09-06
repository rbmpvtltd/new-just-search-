import { api, methods } from "@/lib/api";
import { apiUrl } from "@/constants/Variable";
import { useQuery } from "@tanstack/react-query";

export const useSingleOffer = (offerId: string) => {
  return useQuery({
    queryKey: ["singleOffer"],
    queryFn: async (): Promise<any> => {
      const response = await api(
        methods.get,
        `${apiUrl}/api/offer-details/${offerId}`,
      );
      return response;
    },
  });
};
