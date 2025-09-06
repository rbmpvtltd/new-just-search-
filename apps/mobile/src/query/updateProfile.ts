import { getAuthHeader, getFormAuthHeader } from "@/constants/authHeader";
import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";

export const updateProfile = async (data: any) => {
  const response = await api(
    methods.post,
    `${apiUrl}/api/profile/update`,
    data,
    getFormAuthHeader(),
  );

  return response;
};
