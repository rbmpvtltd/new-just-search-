import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";

export type VerifyOtpData = {
  mobile_no: string;
  otp: string;
  password: string;
};

export const verifyBusinessOtp = async (data: VerifyOtpData): Promise<any> => {
  const response = await api(
    methods.post,
    `${apiUrl}/api/verify-business-otp`,
    data,
  );
  return response;
};
