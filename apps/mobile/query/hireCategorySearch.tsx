import { useInfiniteQuery } from "@tanstack/react-query";
import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";

export const useHireSearchCategory = (title: string, city: string) => {
  return useInfiniteQuery({
    queryKey: ["offerSearchCategory", title, city],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api(
        methods.get,
        `${apiUrl}/api/search-hire-suggestion?city=${city}&title=${title}&page=${pageParam}`,
        {
          headers: {
            Accept: "application/json",
          },
        },
      );

      return {
        data: response.data,
        nextPage: pageParam + 1,
        isLast: response.data.length === 0,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.isLast ? null : lastPage.nextPage;
    },
  });
};
