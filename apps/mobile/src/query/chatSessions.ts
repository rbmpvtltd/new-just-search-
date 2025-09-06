import { api, methods } from "@/lib/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getAuthHeader } from "@/constants/authHeader";
import { apiUrl } from "@/constants/Variable";

export const useChatSessions = () => {
  return useSuspenseQuery({
    queryKey: ["chatSessions"],
    queryFn: async (): Promise<any> => {
      const headers = getAuthHeader();
      const response = await api(
        methods.get,
        `${apiUrl}/api/chatsessions`,
        {},
        {
          headers,
        },
      );

      return response;
    },
  });
};
