import { useMutation } from "@tanstack/react-query";
import { api, methods } from "@/lib/api";
import { apiUrl } from "@/constants/Variable";
import { getAuthHeader } from "@/constants/authHeader";

interface StartOfferChatParams {
  listingId: string;
  offerId: string;
}

export const useStartOfferChat = () => {
  return useMutation({
    mutationFn: async ({
      listingId,
      offerId,
    }: StartOfferChatParams): Promise<any> => {
      const response = await api(
        methods.get,
        `${apiUrl}/api/startofferchat/${listingId}/${offerId}`,
        {},
        { headers: getAuthHeader() },
      );
      return response;
    },
  });
};
