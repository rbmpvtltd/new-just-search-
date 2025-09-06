import { useInfiniteQuery } from "@tanstack/react-query";
import { api, methods } from "@/lib/api";
import { apiUrl } from "@/constants/Variable";

export const useSearchCities = (city: string) => {
  return useInfiniteQuery({
    queryKey: ["cities", city],
    queryFn: async ({ pageParam = 1 }): Promise<any> => {
      const response = await api(
        methods.get,
        `${apiUrl}/api/city-suggestion?city=${city}&page=${pageParam}`,
      );
      return {
        data: response.data,
        nextPage: pageParam + 1,
        isLast: response.data.data.length === 0,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.isLast ? null : lastPage.nextPage;
    },
  });
};
