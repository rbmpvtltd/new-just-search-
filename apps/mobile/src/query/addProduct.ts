import { getAuthHeader, getFormAuthHeader } from "@/constants/authHeader";
import { apiUrl } from "@/constants/Variable";
import { useAuthStore } from "@/features/auth/authStore";
import { api, methods } from "@/lib/api";

export const addProductApi = async (data: any): Promise<any> => {
  const response = await api(
    methods.post,
    `${apiUrl}/api/storeproduct`,
    data,
    getFormAuthHeader(),
  );

  return response;
};
