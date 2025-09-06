import { useMutation } from "@tanstack/react-query";
import { api, methods } from "@/lib/api";
import { apiUrl } from "@/constants/Variable";
import { getAuthHeader } from "@/constants/authHeader";

interface StartOfferChatParams {
  listingId: string;
  productId: string;
}

export const useStartProductChat = () => {
  return useMutation({
    mutationFn: async ({
      listingId,
      productId,
    }: StartOfferChatParams): Promise<any> => {
      const response = await api(
        methods.get,
        `${apiUrl}/api/startproductchat/${listingId}/${productId}`,
        {},
        { headers: getAuthHeader() },
      );
      return response;
    },
  });
};
