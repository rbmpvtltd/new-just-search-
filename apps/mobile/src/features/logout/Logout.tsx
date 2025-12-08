import { useRouter } from "expo-router";
import { Alert, Text, View } from "react-native";
import { queryClient } from "@/lib/trpc";
import { useAuthStore } from "@/store/authStore";

export default function Logout() {
  const router = useRouter();
  const clearToken = useAuthStore((state) => state.clearToken);

  (() => {
    Alert.alert(
      "Logout Confirmation",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {
            router.back();
          },
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            clearToken();
            queryClient.clear();
            console.log("User logged out");
            router.replace("/(root)/(home)/home");
          },
        },
      ],
      { cancelable: false },
    );
  })();

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="bg-error-content  text-error rounded-xl text-xl px-8 py-2">
        Logging out...
      </Text>
    </View>
  );
}
