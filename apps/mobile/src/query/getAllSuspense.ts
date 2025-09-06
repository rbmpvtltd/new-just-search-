import { api, methods } from "@/lib/api";
import { apiUrl } from "@/constants/Variable";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getFormAuthHeader, getJsonAuthHeader } from "@/constants/authHeader";

export const useSuspenceData = (
  url: string,
  key: string,
  params?: string,
  isForm: boolean = false,
) => {
  return useSuspenseQuery({
    queryKey: [key, params],
    queryFn: async (): Promise<any> => {
      const response = await api(
        methods.get,
        `${apiUrl}${url}${params ? `${params}` : ""}`,
        {},
        isForm ? getFormAuthHeader() : getJsonAuthHeader(),
      );
      return response;
    },
  });
};
