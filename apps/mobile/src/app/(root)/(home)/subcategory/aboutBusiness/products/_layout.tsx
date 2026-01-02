import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Pressable } from "react-native";

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="singleProduct" options={{ headerShown: true }} />
      <Stack.Screen
        name="index"
        options={{
          title: "Products",
          headerShown: true,
          headerBackVisible: true,
          headerLeft: () => (
            <Pressable className="ml-2" onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} />
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
