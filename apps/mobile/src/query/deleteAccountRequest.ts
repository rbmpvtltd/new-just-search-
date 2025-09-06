import { getFormAuthHeader, getJsonAuthHeader } from "@/constants/authHeader";
import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";

export const deleteAccountRequest = async (data: any): Promise<any> => {
  const response = await api(
    methods.post,
    `https://www.justsearch.net.in/api/request-account`,
    data,
    getJsonAuthHeader(),
  );
  return response;
};
