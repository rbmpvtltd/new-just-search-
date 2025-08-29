import { getFormAuthHeader } from "@/constants/authHeader";
import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";

export const updateProduct = async (
  data: any,
  token: string,
  id: string,
): Promise<any> => {
  const response = await api(
    methods.post,
    `${apiUrl}/api/updateproduct/${id}`,
    data,
    getFormAuthHeader(),
  );
  return response;
};
