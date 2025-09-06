import { useEffect, useState } from "react";
import { deleteToken, getToken } from "../utils/secureStore";
import { useAuthStore } from "../store/authStore";
import { fetchVerifyAuth } from "@/query/auth";

export function useLoadToken() {
  const setToken = useAuthStore((state) => state.setToken);
  const clearToken = useAuthStore((state) => state.clearToken);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = await getToken();
      const user = await fetchVerifyAuth(token);
      if (!user.success) {
        await deleteToken();
        clearToken();
      } else {
        setToken(user.token, user.role);
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  return { loading };
}
