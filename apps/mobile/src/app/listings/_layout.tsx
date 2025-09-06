import { Tabs } from "expo-router";
import { useColorScheme, Pressable, Text } from "react-native";
import Colors from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].primary,
        headerShown: true,
      }}
    ></Tabs>
  );
}
