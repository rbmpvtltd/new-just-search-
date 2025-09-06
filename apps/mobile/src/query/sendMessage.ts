import { useMutation } from "@tanstack/react-query";
import { api, methods } from "@/lib/api";
import { getAuthHeader } from "@/constants/authHeader";
import { apiUrl } from "@/constants/Variable";

const urls = [
  "",
  `${apiUrl}/api/send-message`,
  `${apiUrl}/api/send-offer-message`,
  `${apiUrl}/api/send-product-message`,
];

export const useSendMessage = () => {
  return useMutation({
    mutationFn: async ({
      sessionType,
      body,
    }: {
      sessionType: number;
      body: {
        message: string;
        chat_session_id: number;
        sender_type: string;
      };
    }): Promise<any> => {
      const response = await api(
        methods.post,
        `${urls[sessionType]}`,

        body,
        { headers: getAuthHeader() },
      );
      return response;
    },
  });
};
