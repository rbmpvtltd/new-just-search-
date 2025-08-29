import { api, methods } from "@/lib/api";
import { apiUrl } from "@/constants/Variable";
import { useQuery } from "@tanstack/react-query";
import { getAuthHeader } from "@/constants/authHeader";

export const useChatMessages = (chatSessionId: string) => {
  return useQuery({
    queryKey: ["chatMessages", chatSessionId],
    queryFn: async (): Promise<any> => {
      const response = await api(
        methods.get,
        `${apiUrl}/api/chatmessages/${chatSessionId}`,
        {},
        {
          headers: getAuthHeader(),
        },
      );
      return response;
    },
    refetchInterval: 500,
  });
};
