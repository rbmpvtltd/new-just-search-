import { api, methods } from "@/lib/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { apiUrl } from "@/constants/Variable";

export const useHireSearchLists = (city: string, title: string) => {
  return useInfiniteQuery({
    queryKey: ["searchList", city, title],
    queryFn: async ({ pageParam = 1 }): Promise<any> => {
      const response = await api(
        methods.get,
        `${apiUrl}/api/search-hire?title=${title}&city=${city}&page=${pageParam}`,
      );

      // Check if response has an error status code
      if (response.status && response.status !== 200) {
        console.log(`Server error with status code: ${response.status}`);
        throw new Error(`Server error: ${response.message || "Unknown error"}`);
      }

      const responseData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      return {
        statusCode: response?.status,
        data: responseData,
        nextPage: pageParam + 1,
        isLast: responseData.length === 0,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.isLast ? null : lastPage.nextPage;
    },
  });
};
