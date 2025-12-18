import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import { useAuthStore } from "@/features/auth/authStore";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isAuthenticated = useAuthStore((state) => state.authenticated);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].primary,
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarStyle: { display: "none" },
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
