// @/query/clearNotifications.ts
import { useMutation } from "@tanstack/react-query";
import { api, methods } from "@/lib/api";
import { getAuthHeader } from "@/constants/authHeader";
import { apiUrl } from "@/constants/Variable";

export const useClearNotification = () => {
  return useMutation({
    mutationFn: async () => {
      const headers = getAuthHeader();
      const response = await api(
        methods.get, // Better to use POST for mutations
        `${apiUrl}/api/notification-clear`,
        {},
        { headers },
      );
      return response;
    },
  });
};
