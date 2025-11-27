import { queryClient } from "@/lib/trpc";
import { getAuthHeader } from "@/constants/authHeader";
import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export const deleteProduct = async (data: any, id: string): Promise<any> => {
  const response = await api(
    methods.post,
    `${apiUrl}/api/deleteproduct/${id}`,
    data,
    { headers: getAuthHeader() },
  );

  return response;
};

export const useDeleteProduct = () => {
  return useMutation({
    mutationFn: async ({ data, id }: { data: any; id: string }) => {
      return deleteProduct(data, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productList"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
