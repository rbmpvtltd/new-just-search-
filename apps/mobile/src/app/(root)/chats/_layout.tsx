import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Pressable, Text, useColorScheme, View } from "react-native";
import Colors from "@/constants/Colors";

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
          headerTitle: "All Messages", // TODO: this will be set into there screen for specific name
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
          headerTitle: "Chat",
          // headerTitle: () => {
          //   return (
          //     <View className="flex-row items-center gap-4  px-4 py-2 rounded-lg sticky">
          //       <Ionicons
          //         name="person-circle-outline"
          //         size={20}
          //         color={Colors[colorScheme ?? "light"].secondary}
          //       />
          //       <Text className="text-secondary font-semibold text-lg">
          //         Private Chats
          //       </Text>
          //     </View>
          //   );
          // },
        }}
      />
    </Stack>
  );
}
