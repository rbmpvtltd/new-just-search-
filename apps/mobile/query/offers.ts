import { api, methods } from "@/lib/api";
import { apiUrl } from "@/constants/Variable";
import { useSuspenseQuery } from "@tanstack/react-query";

const fetchOffers = async (): Promise<any> => {
  const response = await api(methods.get, `${apiUrl}/api/get-offers`);

  return response;
};

export const useAllOffers = () => {
  return useSuspenseQuery({
    queryKey: ["offersList"],
    queryFn: fetchOffers,
  });
};
