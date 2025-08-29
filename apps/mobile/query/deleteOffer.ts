import { queryClient } from "@/app/_layout";
import { getAuthHeader } from "@/constants/authHeader";
import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export const deleteOffer = async (data: any, id: string): Promise<any> => {
  const response = await api(
    methods.post,
    `${apiUrl}/api/deleteoffer/${id}`,
    data,
    {
      headers: getAuthHeader(),
    },
  );

  return response;
};

export const useDeleteOffer = () => {
  return useMutation({
    mutationFn: async ({ data, id }: { data: any; id: string }) => {
      return deleteOffer(data, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offerList"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
