import { Redirect } from "expo-router";
import { Loading } from "@/components/ui/Loading";
import { useLoadToken } from "@/hooks/useLoadToken";

export default function Index() {
  const { loading } = useLoadToken();
  if (loading) {
    return <Loading position="center" />;
  }

  return <Redirect href="/user/bottomNav" />;
}
