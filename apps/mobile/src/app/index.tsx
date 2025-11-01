import { Redirect } from "expo-router";
import { Loading } from "@/components/ui/Loading";
import { useLoadToken } from "@/hooks/useLoadToken";
import { useAuthStore } from "@/store/authStore";

export default function Index() {
  const data = useLoadToken();
  const token = useAuthStore((state) => state.token);
  if (data?.isLoading) {
    return <Loading position="center" />;
  }

  console.log("token is ", token);

  return <Redirect href="/(root)/(home)/home" />;
}
