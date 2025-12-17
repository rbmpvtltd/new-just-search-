import { useQueryClient } from "@tanstack/react-query";
import { useNavigation, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useAuthStore } from "@/store/authStore";
import { deleteTokenRole } from "@/utils/secureStore";

export default function Logout() {
  // const router = useRouter();
  const clearToken = useAuthStore((state) => state.clearToken);
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const logout = async () => {
    await deleteTokenRole();
    clearToken();
    queryClient.clear();
    navigation.reset({
      index: 0,
      routes: [],
    });
    // await Purchases.logOut();
    // router.replace("/");
  };
  return (
    <View className="flex-1 justify-center gap-4 items-center">
      <Text className="text-secondary text-xl">
        Are you sure you wanna logout
      </Text>
      <Pressable onPress={logout}>
        <Text className="bg-error-content  text-error rounded-xl text-xl px-8 py-2">
          Logout
        </Text>
      </Pressable>
    </View>
  );
}
