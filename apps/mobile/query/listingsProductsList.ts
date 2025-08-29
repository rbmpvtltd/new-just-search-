import { api, methods } from "@/lib/api";
import { apiUrl } from "@/constants/Variable";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useListingProductList = (listingId: string) => {
  return useSuspenseQuery({
    queryKey: ["listingProductList"],
    queryFn: async (): Promise<any> => {
      const response = await api(
        methods.get,
        `${apiUrl}/api/get-products-listing/${listingId}`,
      );

      return response;
    },
  });
};
