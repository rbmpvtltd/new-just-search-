import { getJsonAuthHeader } from "@/constants/authHeader";
import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";
import { useSuspenseQuery } from "@tanstack/react-query";

export const getChatSessions: () => Promise<any> = async (): Promise<any> =>
  await api(methods.get, `${apiUrl}/api/chatsessions`, {}, getJsonAuthHeader());

export const useChatSession = () => {
  return useSuspenseQuery({
    queryKey: ["chatSessions"],
    queryFn: async (): Promise<any> => await getChatSessions(),
    select: (data) =>
      data.chat_sessions
        .filter((item: any) => item.type === 1)
        .sort(
          (a: any, b: any) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
        ),
  });
};

export const useOfferSession = () => {
  return useSuspenseQuery({
    queryKey: ["chatSessions"],
    queryFn: async (): Promise<any> => await getChatSessions(),
    select: (data) =>
      data.chat_sessions
        .filter((item: any) => item.type === 2)
        .sort(
          (a: any, b: any) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
        ),
  });
};

export const useProductSession = () => {
  return useSuspenseQuery({
    queryKey: ["chatSessions"],
    queryFn: async (): Promise<any> => await getChatSessions(),
    select: (data) =>
      data.chat_sessions
        .filter((item: any) => item.type === 3)
        .sort(
          (a: any, b: any) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
        ),
  });
};
