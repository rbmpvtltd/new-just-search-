import { useQuery } from "@tanstack/react-query";
import { getTokenRole } from "@/utils/secureStore";
import { useAuthStore } from "../store/authStore";

export function useLoadToken() {
  const setTokenRole = useAuthStore((state) => state.setToken);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getexpostore"],
    queryFn: async () => await getTokenRole(),
  });
  if (!isLoading) {
    if (isError) {
      // TODO: send to online logger;
      console.error(error);
      return;
    }
    setTokenRole(data?.token || null, data?.role || null);
    return { success: true };
  }
  return { isLoading };
}
