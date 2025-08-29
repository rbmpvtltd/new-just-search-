import { api, methods } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export interface cryptoNameInterface {
  data: [string];
}

export const cryptoNameList: () => Promise<cryptoNameInterface> = async () =>
  await api(methods.post, "/api/v1/users/crypto-name-list");

export const useCryptoNameList = () => {
  return useQuery({
    queryKey: ["cryptoNameList"],
    queryFn: async () => await cryptoNameList(),
  });
};
