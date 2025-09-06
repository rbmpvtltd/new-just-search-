import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";
import type { LoginVisitorFormData } from "@/schemas/loginSchema";

export const sendVisitorOtp = async (data: {
  mobile_no: string;
}): Promise<any> => {
  const response = await api(methods.post, `${apiUrl}/api/send-otp`, data);
  return response;
};

export const fetchVisitorData = async (
  data: LoginVisitorFormData,
): Promise<any> => {
  const response = await api(methods.post, `${apiUrl}/api/verify-otp`, data);
  return response;
};
