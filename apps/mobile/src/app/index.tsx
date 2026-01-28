import { Redirect } from "expo-router";
import { Loading } from "@/components/ui/Loading";
import { useLoadToken } from "@/hooks/useLoadToken";
import { View } from "react-native";

export default function Index() {
  const data = useLoadToken();

  if (data?.isLoading) {
    return <View className="flex-1 justify-center items-center"><Loading position="center" /></View>;
  }
  return <Redirect href="/(root)/(home)/home" />;
}
