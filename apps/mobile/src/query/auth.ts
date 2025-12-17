import type { UserRole } from "@repo/db";
import { getAuthHeader } from "@/constants/authHeader";
import { apiUrl } from "@/constants/Variable";
import type { LoginBusinessFormData } from "@/features/auth/schema/loginSchema";
import { api, methods } from "@/lib/api";
import type { ChangePasswordData } from "@/schemas/changePasswordSchema";

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
