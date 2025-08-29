import { getFormAuthHeader } from "@/constants/authHeader";
import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";

export const updateOffer = async (data: any, id: string): Promise<any> => {
  const response = await api(
    methods.post,
    `${apiUrl}/api/updateoffer/${id}`,
    data,
    getFormAuthHeader(),
  );
  return response;
};
