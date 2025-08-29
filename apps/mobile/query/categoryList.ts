import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useListingCategory = (title: string) => {
  return useSuspenseQuery({
    queryKey: ["categoryListings"],
    queryFn: async (): Promise<any> => {
      const response = await api(
        methods.get,
        `${apiUrl}/api/listing-category?id=${title}`,
        {},
      );
      return response.data.listings;
    },
  });
};
