import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, useColorScheme, View } from "react-native";
import Colors from "@/constants/Colors";

export default function DataNotFound() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  return (
    <View className="flex flex-1 px-8 py-4 bg-base-100 justify-center items-center">
      <Text className="text-secondary text-2xl">No Data Found</Text>
      <Pressable
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace("/user/bottomNav");
          }
        }}
      >
        <Ionicons
          name="arrow-back-circle-outline"
          color={Colors[colorScheme ?? "light"]["base-300"]}
          size={50}
        />
      </Pressable>
    </View>
  );
}
