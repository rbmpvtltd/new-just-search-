import { apiUrl } from "@/constants/Variable";
import type { ForgetPasswordFormData } from "@/features/auth/schema/loginSchema";
import { api, methods } from "@/lib/api";

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
