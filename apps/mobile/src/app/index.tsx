import { Redirect } from "expo-router";
import { Loading } from "@/components/ui/Loading";
import { useLoadToken } from "@/hooks/useLoadToken";

export default function Index() {
  const data = useLoadToken();

  if (data?.isLoading) {
    return <Loading position="center" />;
  }
  return <Redirect href="/(root)/(home)/home" />;
}
