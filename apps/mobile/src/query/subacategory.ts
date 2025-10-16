// import { useInfiniteQuery } from "@tanstack/react-query";
// import { apiUrl } from "@/constants/Variable";
// import { api, methods } from "@/lib/api";

// export const useSubCategoryList = (subCatgoryId: number | string) => {
//   return useInfiniteQuery({
//     queryKey: ["hireList", subCatgoryId],
//     queryFn: async ({ pageParam = 1 }): Promise<any> => {
//       const response = await api(
//         methods.get,
//         `${apiUrl}/api/listing-category/${subCatgoryId}?page=${pageParam}`,
//         {},
//       );

//       return {
//         data: response.data,
//         nextPage: pageParam + 1,
//         isLast: response?.data?.length === 0, // ya aapke API me `has_more` jaise flag ho to wo check karein
//       };
//     },
//     initialPageParam: 1,
//     getNextPageParam: (lastPage) => {
//       return lastPage.isLast ? null : lastPage.nextPage;
//     },
//   });
// };
//
// --------------------------------------------------------------------------------------------------------
// import { trpc } from "@/lib/trpc";
// import { useInfiniteQuery } from "@tanstack/react-query";

import { useInfiniteQuery } from "@tanstack/react-query";
// export function useSubcategoryList(categoryId: number) {
//   return useInfiniteQuery({
//     queryKey: ["subcategoryRouter.subcategory", categoryId],
//     queryFn: async ({ pageParam = 1 }) => {
//       const data = await trpc.subcategoryRouter.subcategory.queryOptions({
//         categoryId,
//         limit: 10,
//         page: pageParam,
//       });
//       return data;
//     },
//     initialPageParam: 1,
//     getNextPageParam: (lastPage) => {
//       const { page, totalPages } = lastPage;
//       return page < totalPages ? page + 1 : undefined;
//     },
//   });
// }
// ------------------------------------------------------------------------------------------------------
import { trpc } from "@/lib/trpc";

export function useSubcategoryList(categoryId: number) {
  return useInfiniteQuery({
    ...trpc.subcategoryRouter.subcategory.infiniteQueryOptions({
      categoryId,
      limit: 10,
      page: 1,
    }),
  });
}
