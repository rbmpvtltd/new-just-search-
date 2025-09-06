import { getAuthHeader } from "@/constants/authHeader";
import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";
import { useSuspenseQuery } from "@tanstack/react-query";

export const fetchMyHire = async (): Promise<any> => {
  const response = await api(
    methods.get,
    `${apiUrl}/api/myhire`,
    {},
    { headers: getAuthHeader() },
  );
  return response.data;
};

export const useMyHire = () => {
  return useSuspenseQuery({
    queryKey: ["myHire"],
    queryFn: fetchMyHire,
  });
};
