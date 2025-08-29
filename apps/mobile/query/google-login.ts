import { getJsonAuthHeader } from "@/constants/authHeader";
import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";
import type { role } from "@/store/authStore";

interface IloginWithGoogleRequest {
  email: string;
  id: string;
  name?: string;
  photo?: string;
}

interface IloginWithGoogleResponse {
  success: boolean;
  message: string;
  status: number;
  role: role;
  token: string;
}

export const loginWithGoogle = async (
  data: IloginWithGoogleRequest,
): Promise<IloginWithGoogleResponse> => {
  const response = await api(
    methods.post,
    `${apiUrl}/api/google-login`,
    data,
    getJsonAuthHeader(),
  );

  return response;
};
