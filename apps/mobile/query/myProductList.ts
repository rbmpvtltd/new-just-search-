import { getAuthHeader } from "@/constants/authHeader";
import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useProductList = () => {
  return useInfiniteQuery({
    queryKey: ["productList"],
    queryFn: async ({ pageParam = 1 }): Promise<any> => {
      const res = await api(
        methods.get,
        `${apiUrl}/api/myproducts?page=${pageParam}`,
        {},
        {
          headers: getAuthHeader(),
        },
      );

      const products = res.data.products.data;

      return {
        data: products,
        nextPage: pageParam + 1,
        isLast: res.data.length === null,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.isLast ? null : lastPage.nextPage;
    },
  });
};
