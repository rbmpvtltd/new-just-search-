import { useInfiniteQuery } from "@tanstack/react-query";
import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";

export const useSubCategoryList = (subCatgoryId: number | string) => {
  return useInfiniteQuery({
    queryKey: ["hireList", subCatgoryId],
    queryFn: async ({ pageParam = 1 }): Promise<any> => {
      const response = await api(
        methods.get,
        `${apiUrl}/api/listing-category/${subCatgoryId}?page=${pageParam}`,
        {},
      );

      return {
        data: response.data,
        nextPage: pageParam + 1,
        isLast: response?.data?.length === 0, // ya aapke API me `has_more` jaise flag ho to wo check karein
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.isLast ? null : lastPage.nextPage;
    },
  });
};
