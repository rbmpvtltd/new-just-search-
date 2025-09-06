import { getJsonAuthHeader } from "@/constants/authHeader";
import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

export interface IgetNotificationCount {
  unread_count: string;
}

export const getNotificationCount: () => Promise<IgetNotificationCount> =
  async (): Promise<IgetNotificationCount> =>
    await api(
      methods.get,
      `${apiUrl}/api/notification-count`,
      {},
      getJsonAuthHeader(),
    );

export const useNotificationCount = () => {
  return useSuspenseQuery({
    queryKey: ["getNotificationCount"],
    queryFn: async (): Promise<IgetNotificationCount> =>
      await getNotificationCount(),
  });
};

export const useMaskAsRead = () => {
  return useMutation({
    mutationFn: async (notification_id: string): Promise<any> => {
      const response = await api(
        methods.get,
        `${apiUrl}/api/notification/mark-as-read/${notification_id}`,
        {},
        getJsonAuthHeader(),
      );
      return response;
    },
  });
};
