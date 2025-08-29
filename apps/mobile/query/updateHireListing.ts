import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";

export const updateHireListing = async (
  data: any,
  token: string,
  id: any,
): Promise<any> => {
  try {
    const response = await api(
      methods.post,
      `${apiUrl}/api/update-hirelisting/${id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
  } catch (error: any) {
    console.log("Error response:", error?.response?.data || error.message);
    throw error;
  }
};
