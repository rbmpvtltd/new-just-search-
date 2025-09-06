import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useColorScheme, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Colors from "@/constants/Colors"; // apni file ka path correct karo
import { role, useAuthStore } from "@/store/authStore";

export default function Layout() {
  const colorScheme = useColorScheme();
  const roleUser = useAuthStore((state) => state.role);

  return (
    <GestureHandlerRootView className="flex-1">
      <Drawer
      
        screenOptions={{
          headerShown: true,
          drawerActiveTintColor: Colors[colorScheme ?? "light"].primary,
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: "Profile Detail",
            drawerItemStyle: {
              display: "none",
            },
            drawerIcon: ({ color }) => (
              <Ionicons name="briefcase-outline" size={20} color={color} />
            ),
            headerRight: () => (
              <View className="mr-4">
                <Link href="/(root)/(home)/home" asChild>
                  <Ionicons
                    name="home-outline"
                    size={24}
                    color={Colors[colorScheme ?? "light"].secondary}
                  />
                </Link>
              </View>
            ),
          }}
        />
       

        <Drawer.Screen
          name="bussinessList"
          options={{
            title: "My Bussiness Listing",
            drawerItemStyle: {
              display:
                roleUser === role.lister || roleUser === role.business
                  ? "flex"
                  : "none",
            },
            drawerIcon: ({ color }) => (
              <Ionicons name="briefcase-outline" size={20} color={color} />
            ),
            headerRight: () => (
              <View className="mr-4">
                <Link href="/(root)/(home)/home" asChild>
                  <Ionicons
                    name="home-outline"
                    size={24}
                    color={Colors[colorScheme ?? "light"].secondary}
                  />
                </Link>
              </View>
            ),
          }}
        />

        <Drawer.Screen
          name="product"
          options={{
            title: "Product",
            drawerItemStyle: {
              display: roleUser === "business" ? "flex" : "none",
            },
            drawerIcon: ({ color }) => (
              <Ionicons name="cube-outline" size={20} color={color} />
            ),
            headerRight: () => (
              <View className="mr-4">
                <Link href="/(root)/(home)/home" asChild>
                  <Ionicons
                    name="home-outline"
                    size={24}
                    color={Colors[colorScheme ?? "light"].secondary}
                  />
                </Link>
              </View>
            ),
          }}
        />

        <Drawer.Screen
          name="addProduct"
          options={{
            title: "Add Product",
            drawerItemStyle: {
              display: roleUser === role.business ? "flex" : "none",
            },
            drawerIcon: ({ color }) => (
              <Ionicons name="add-circle-outline" size={20} color={color} />
            ),
            headerRight: () => (
              <View className="mr-4">
                <Link href="/(root)/(home)/home" asChild>
                  <Ionicons
                    name="home-outline"
                    size={24}
                    color={Colors[colorScheme ?? "light"].secondary}
                  />
                </Link>
              </View>
            ),
          }}
        />
        <Drawer.Screen
          name="offers"
          options={{
            title: "Offers",
            drawerItemStyle: {
              display: roleUser === "business" ? "flex" : "none",
            },
            drawerIcon: ({ color }) => (
              <Ionicons name="pricetags-outline" size={20} color={color} />
            ),
            headerRight: () => (
              <View className="mr-4">
                <Link href="/(root)/(home)/home" asChild>
                  <Ionicons
                    name="home-outline"
                    size={24}
                    color={Colors[colorScheme ?? "light"].secondary}
                  />
                </Link>
              </View>
            ),
          }}
        />
        <Drawer.Screen
          name="addOffer"
          options={{
            title: "Add Offers",
            drawerItemStyle: {
              display: roleUser === "business" ? "flex" : "none",
            },
            drawerIcon: ({ color }) => (
              <Ionicons name="gift-outline" size={20} color={color} />
            ),
            headerRight: () => (
              <View className="mr-4">
                <Link href="/(root)/(home)/home" asChild>
                  <Ionicons
                    name="home-outline"
                    size={24}
                    color={Colors[colorScheme ?? "light"].secondary}
                  />
                </Link>
              </View>
            ),
          }}
        />

        <Drawer.Screen
          name="pricingPlans"
          options={{
            title: "Pricing Plans",
            drawerItemStyle: {
              display: roleUser === role.visitor ? "none" : "flex",
            },
            drawerIcon: ({ color }) => (
              <Ionicons name="wallet-outline" size={20} color={color} />
            ),
            headerRight: () => (
              <View className="mr-4">
                <Link href="/(root)/(home)/home" asChild>
                  <Ionicons
                    name="home-outline"
                    size={24}
                    color={Colors[colorScheme ?? "light"].secondary}
                  />
                </Link>
              </View>
            ),
          }}
        />

        <Drawer.Screen
          name="feedback"
          options={{
            title: "Feedback",
            drawerIcon: ({ color }) => (
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={color}
              />
            ),
            headerRight: () => (
              <View className="mr-4">
                <Link href="/(root)/(home)/home" asChild>
                  <Ionicons
                    name="home-outline"
                    size={24}
                    color={Colors[colorScheme ?? "light"].secondary}
                  />
                </Link>
              </View>
            ),
          }}
        />

        <Drawer.Screen
          name="deleteReq"
          options={{
            title: "Delete Request",
            drawerIcon: ({ color }) => (
              <Ionicons name="trash-outline" size={20} color={color} />
            ),
            headerRight: () => (
              <View className="mr-4">
                <Link href="/(root)/(home)/home" asChild>
                  <Ionicons
                    name="home-outline"
                    size={24}
                    color={Colors[colorScheme ?? "light"].secondary}
                  />
                </Link>
              </View>
            ),
          }}
        />

        <Drawer.Screen
          name="analytics"
          options={{
            title: "Analytics",
            drawerIcon: ({ color }) => (
              <Ionicons name="analytics-outline" size={20} color={color} />
            ),
            headerRight: () => (
              <View className="mr-4">
                <Link href="/(root)/(home)/home" asChild>
                  <Ionicons
                    name="home-outline"
                    size={24}
                    color={Colors[colorScheme ?? "light"].secondary}
                  />
                </Link>
              </View>
            ),
          }}
        />

        <Drawer.Screen
          name="hirelisting"
          options={{
            title: "Hire Listing",
            drawerItemStyle: {
              display:
                roleUser === role.lister || roleUser === role.hire
                  ? "flex"
                  : "none",
            },
            drawerIcon: ({ color }) => (
              <Ionicons name="people-outline" size={20} color={color} />
            ),
            headerRight: () => (
              <View className="mr-4">
                <Link href="/(root)/(home)/home" asChild>
                  <Ionicons
                    name="home-outline"
                    size={24}
                    color={Colors[colorScheme ?? "light"].secondary}
                  />
                </Link>
              </View>
            ),
          }}
        />
        <Drawer.Screen
          name="changePassword"
          options={{
            title: "Change Password",
            drawerIcon: ({ color }) => (
              <Ionicons name="lock-closed-outline" size={20} color={color} />
            ),
            headerRight: () => (
              <View className="mr-4">
                <Link href="/(root)/(home)/home" asChild>
                  <Ionicons
                    name="home-outline"
                    size={24}
                    color={Colors[colorScheme ?? "light"].secondary}
                  />
                </Link>
              </View>
            ),
          }}
        />

        <Drawer.Screen
          name="termCondition"
          options={{
            headerShown: false,
            title: "Term's & Conditions",
            drawerIcon: ({ color }) => (
              <Ionicons name="shield-outline" size={20} color={color} />
            ),
            headerRight: () => (
              <View className="mr-4">
                <Link href="/(root)/(home)/home" asChild>
                  <Ionicons
                    name="home-outline"
                    size={24}
                    color={Colors[colorScheme ?? "light"].secondary}
                  />
                </Link>
              </View>
            ),
          }}
        />

        <Drawer.Screen
          name="logout"
          options={{
            title: "Logout",
            drawerIcon: ({ color }) => (
              <Ionicons name="log-out-outline" size={20} color={color} />
            ),
            headerRight: () => (
              <View className="mr-4">
                <Link href="/(root)/(home)/home" asChild>
                  <Ionicons
                    name="home-outline"
                    size={24}
                    color={Colors[colorScheme ?? "light"].secondary}
                  />
                </Link>
              </View>
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
