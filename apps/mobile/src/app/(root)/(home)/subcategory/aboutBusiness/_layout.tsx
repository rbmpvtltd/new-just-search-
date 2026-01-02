import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack, Tabs, usePathname } from "expo-router";
import type React from "react";
import { useEffect, useState } from "react";
import { Pressable, useColorScheme } from "react-native";
import Colors from "@/constants/Colors";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const [showTabbar, setShowTabbar] = useState<boolean>(false);
  useEffect(() => {
    const excludedTabRoute = [
      "/subcategory/aboutBusiness/products/singleProduct",
      "/subcategory/aboutBusiness/offers/singleOffers",
    ];
    for (const val of excludedTabRoute) {
      if (pathname.startsWith(val)) {
        setShowTabbar(true);
        return;
      } else {
        setShowTabbar(false);
      }
    }
  }, [pathname]);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].primary,
        headerShown: false,
        tabBarStyle: showTabbar ? { display: "none" } : {},
        sceneStyle: { backgroundColor: "white" },
      }}
    >
      <Tabs.Screen
        name="[premiumshops]"
        options={{
          title: "About Business ",
          headerShown: true,
          headerLeft: () => (
            <Pressable className="ml-6 " onPress={() => router.back()}>
              <Ionicons
                name="arrow-back"
                size={24}
                className="p-2 mr-4 self-center"
              />
            </Pressable>
          ),
          tabBarLabel: "Business",
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
          title: "Offers",
          tabBarIcon: ({ color }) => (
            <Ionicons name="pricetags-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          headerShown: false,
          title: "Products",
          tabBarIcon: ({ color }) => (
            <Ionicons name="cart-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
