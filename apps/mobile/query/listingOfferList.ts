import { api, methods } from "@/lib/api";
import { apiUrl } from "@/constants/Variable";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useListingOffersList = (listingId: string) => {
  return useSuspenseQuery({
    queryKey: ["listingsOffersList"],
    queryFn: async (): Promise<any> => {
      const response = await api(
        methods.get,
        `${apiUrl}/api/get-offers-listing/${listingId}`,
      );

      return response;
    },
  });
};
