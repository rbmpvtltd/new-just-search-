import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Pressable, useColorScheme } from "react-native";

export default function NotificationLayout() {
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
          headerTitle: "All Notifications",
        }}
      />
    </Stack>
  );
}
