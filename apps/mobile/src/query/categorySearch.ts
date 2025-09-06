import { useInfiniteQuery } from "@tanstack/react-query";
import { api, methods } from "@/lib/api";
import { apiUrl } from "@/constants/Variable";

export const useSearchCatogries = (title: string) => {
  return useInfiniteQuery({
    queryKey: ["searchCatogories", title],
    queryFn: async ({ pageParam = 1 }): Promise<any> => {
      const response = await api(
        methods.get,
        `${apiUrl}/api/search-listings?title=${title}&page=${pageParam}`,
        {
          headers: {
            Accept: "application/json",
          },
        },
      );
      return {
        data: response.data,
        nextPage: pageParam + 1,
        isLast: response.data.data.length === 0, // ya aapke API me `has_more` jaise flag ho to wo check karein
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.isLast ? null : lastPage.nextPage;
    },
  });
};
