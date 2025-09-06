import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";

export default function TabLayout() {
  const colorScheme = useColorScheme();
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
          title: "Chats",
          headerShown: false,
          tabBarLabel: "Chats",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="offers"
        options={{
          headerShown: false,
          title: "Offers Chats",
          tabBarIcon: ({ color }) => (
            <Ionicons name="pricetags-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="product"
        options={{
          headerShown: false,
          title: "Products Chats",
          tabBarIcon: ({ color }) => (
            <Ionicons name="cube-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
