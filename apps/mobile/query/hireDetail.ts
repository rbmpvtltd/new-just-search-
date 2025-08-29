import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";
import { useSuspenseQuery } from "@tanstack/react-query";

// const fetchHireDetail = async (): Promise<any> => {
//     const response = await api(
//         methods.get,
//         `${apiUrl}/api/hirelistings/details/kundanmal-bundel`
//     )
// }

export const useHireDetail = (slug: string) => {
  return useSuspenseQuery({
    queryKey: ["hireDetail"],
    queryFn: async (): Promise<any> => {
      const response = await api(
        methods.get,
        `${apiUrl}/api/hirelistings/details/${slug}`,
      );
      return response.data;
    },
  });
};
