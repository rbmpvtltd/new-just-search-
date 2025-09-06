import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";
import type { ForgetPasswordFormData } from "@/schemas/loginSchema";

export const sendForgetPasswordOtp = async (data: {
  mobile_no: string;
}): Promise<any> => {
  const response = await api(
    methods.post,
    `${apiUrl}/api/send-reset-otp`,
    data,
  );

  return response;
};

export const verifyForgetPasswordOtp = async (
  data: ForgetPasswordFormData,
): Promise<any> => {
  const response = await api(
    methods.post,
    `${apiUrl}/api/verify-reset-otp`,
    data,
  );
  return response;
};
