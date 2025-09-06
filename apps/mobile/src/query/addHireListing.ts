import { getFormAuthHeader } from "@/constants/authHeader";
import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";

export const addHireListing = async (data: any): Promise<any> => {
  try {
    const response = await api(
      methods.post,
      `${apiUrl}/api/storehire`,
      data,
      getFormAuthHeader(),
    );
    
    return response;
  } catch (error: any) {
    console.log("Error response:", error?.response?.data || error.message);
    throw error;
  }
};
