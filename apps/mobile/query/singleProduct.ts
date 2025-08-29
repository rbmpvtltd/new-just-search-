import { api, methods } from "@/lib/api";
import { apiUrl } from "@/constants/Variable";
import { useQuery } from "@tanstack/react-query";

export const useSingleProduct = (productId: string) => {
  return useQuery({
    queryKey: ["singleProduct"],
    queryFn: async (): Promise<any> => {
      const response = await api(
        methods.get,
        `${apiUrl}/api/products/${productId}`,
      );
      return response;
    },
  });
};
