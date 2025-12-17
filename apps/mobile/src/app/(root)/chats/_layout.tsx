import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Pressable, Text, useColorScheme, View } from "react-native";

export default function HomeLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerLeft: () => {
            return (
              <Pressable onPress={() => router.back()} className="px-3">
                <Ionicons
                  name="arrow-back"
                  size={22}
                  color={Colors[colorScheme ?? "light"].secondary}
                />
              </Pressable>
            );
          },
          headerTitle: "Chats", // TODO: this will be set into there screen for specific name
        }}
      />
      <Stack.Screen
        name="private-chat/[id]"
        options={{
          headerShown: true,
          headerLeft: () => {
            return (
              <Pressable onPress={() => router.back()} className="px-3">
                <Ionicons
                  name="arrow-back"
                  size={22}
                  color={Colors[colorScheme ?? "light"].secondary}
                />
              </Pressable>
            );
          },
          headerTitle: "Private Chats", // TODO: this will be set into there screen for specific name
        }}
      />
    </Stack>
  );
}
