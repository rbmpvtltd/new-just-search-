import { getAuthHeader } from "@/constants/authHeader";
import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useOfferList = () => {
  return useInfiniteQuery({
    queryKey: ["offerList"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api(
        methods.get,
        `${apiUrl}/api/myoffers?page=${pageParam}`,
        {},
        {
          headers: getAuthHeader(),
        },
      );

      const offers = response.data; // assume it's an array

      return {
        data: offers,
        nextPage: pageParam + 1,
        isLast: offers.length === 0, // fallback condition
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Flatten all previously fetched offer IDs
      const allOfferIds = allPages.flatMap((page) =>
        page.data.map((item: any) => item.id),
      );
      const currentOfferIds = lastPage.data.map((item: any) => item.id);

      // 🔍 Check if every current ID already exists in previous pages
      const isDuplicate = currentOfferIds.every((id: string | number) =>
        allOfferIds.includes(id),
      );

      return lastPage.isLast || isDuplicate ? null : lastPage.nextPage;
    },
  });
};
