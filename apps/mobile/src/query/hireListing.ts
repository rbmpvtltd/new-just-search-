import { useInfiniteQuery } from "@tanstack/react-query";
import { api, methods } from "@/lib/api";
import { apiUrl } from "@/constants/Variable";

const fetchHireListing = async ({ pageParam = 1 }): Promise<any> => {
  const response = await api(
    methods.get,
    `${apiUrl}/api/hirelistings?page=${pageParam}`,
    {},
  );

  return {
    data: response.data.data,
    nextPage: pageParam + 1,
    isLast: response.data.data.length === 0, // ya aapke API me `has_more` jaise flag ho to wo check karein
  };
};

export const useHireList = () => {
  return useInfiniteQuery({
    queryKey: ["hireList"],
    queryFn: fetchHireListing,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.isLast ? null : lastPage.nextPage;
    },
  });
};
