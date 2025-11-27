import { api, methods } from "@/lib/api";
import { LoginBusinessFormData } from "@/schemas/loginSchema";
import { ChangePasswordData } from "@/schemas/changePasswordSchema";
import { getAuthHeader } from "@/constants/authHeader";
import { apiUrl } from "@/constants/Variable";
import { UserRole } from "@repo/db";


export type UserData = {
  success: boolean;
  message: string;
  status: number;
  user: {
    id: number;
    name: string;
    phone: string;
  };
  role: UserRole;
  token: string;
};

export type ChangePassData = {
  success: boolean;
  status: number;
  message: string;
};

export const fetchLogin = async (
  data: LoginBusinessFormData,
): Promise<UserData> => {
  const response = await api(methods.post, `${apiUrl}/api/login`, data);
  return response;
};

export const fetchVerifyAuth = async (
  token: string | null,
): Promise<UserData> => {
  const user = await api(
    methods.get,
    `${apiUrl}/api/verifyauth`,
    {},
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    },
  );
  return user;
};

export const fetchChangePassword = async (
  data: ChangePasswordData,
): Promise<ChangePassData> => {
  const response = await api(
    methods.post,
    `${apiUrl}/api/change-password`,
    data,
    {
      headers: getAuthHeader(),
    },
  );
  return response;
};
