import { getFormAuthHeader } from "@/constants/authHeader";
import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";

export const addBusinessListing = async (data: any): Promise<any> => {
  const response = await api(
    methods.post,
    `${apiUrl}/api/store-listing`,
    data,
    getFormAuthHeader(),
  );

  return response;
};
