import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useCategory = (ALL_CATEGORIES: {
  key: string;
  url: string;
  enabled: boolean;
}) => {
  return useInfiniteQuery({
    queryKey: [ALL_CATEGORIES.key],
    queryFn: async ({ pageParam = 1 }): Promise<any> => {
      const response = await api(
        methods.get,
        `${apiUrl}${ALL_CATEGORIES.url}?page=${pageParam}`,
      );
      return {
        data: response.data,
        nextPage: pageParam + 1,
        isLast: response.data.length === 0,
      };
    },
    initialPageParam: 1,
    enabled: ALL_CATEGORIES.enabled,
    getNextPageParam: (lastPage) => {
      return lastPage.isLast ? null : lastPage.nextPage;
    },
  });
};
