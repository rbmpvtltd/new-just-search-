import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";

export const sendOtp = async (data: { mobile_no: string }): Promise<any> => {
  const response = await api(
    methods.post,
    `${apiUrl}/api/send-business-otp`,
    data,
  );
  return response;
};
