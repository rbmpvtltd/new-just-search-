import { api, methods } from "@/lib/api";
import { apiUrl } from "@/constants/Variable";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

export const useSearchLists = (city: string, title: string) => {
  return useSuspenseInfiniteQuery({
    queryKey: ["searchList", city, title],
    queryFn: async ({ pageParam = 1 }): Promise<any> => {
      const response = await api(
        methods.get,
        `${apiUrl}/api/search?city=${city}&title=${title.trim()}&page=${pageParam}`,
      );
      return {
        data: response.data,
        nextPage: pageParam + 1,
        isLast: response.data.length === 0,
        total: response.total,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.isLast ? null : lastPage.nextPage;
    },
  });
};
