import { getAuthHeader } from "@/constants/authHeader";
import { apiUrl } from "@/constants/Variable";
import { api, methods } from "@/lib/api";
import { useSuspenseQuery } from "@tanstack/react-query";

export const fetchMyListing = async (id: string): Promise<any> => {
  const response = await api(
    methods.get,
    `${apiUrl}/api/listings/${id}`,
    {},
    {
      headers: getAuthHeader(),
    },
  );
  return response;
};

export const useMyListing = (id: string) => {
  return useSuspenseQuery({
    queryKey: ["listing", id],
    queryFn: () => fetchMyListing(id),
  });
};
