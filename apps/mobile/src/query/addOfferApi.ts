import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";

export const addOfferApi = async (data: any, token: string): Promise<any> => {
  const response = await api(methods.post, `${apiUrl}/api/storeoffer`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
