import { useMutation } from "@tanstack/react-query";
import { api, methods } from "@/lib/api";
import { apiUrl } from "@/constants/Variable";
import { getJsonAuthHeader } from "@/constants/authHeader";

export const useStartChat = () => {
  return useMutation({
    mutationFn: async (listingId: string): Promise<any> => {
      const response = await api(
        methods.get,
        `${apiUrl}/api/startchat/${listingId}`,
        {},
        getJsonAuthHeader(),
      );
      return response;
    },
  });
};
