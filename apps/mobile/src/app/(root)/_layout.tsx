import Ionicons from "@expo/vector-icons/Ionicons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Link, router, Tabs, usePathname } from "expo-router";
import { Alert, Image, Text, useColorScheme, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Loading } from "@/components/ui/Loading";
import { SomethingWrong } from "@/components/ui/SomethingWrong";
import Colors from "@/constants/Colors";
import { useNotificationCount } from "@/query/notification/notication";
import { useAuthStore } from "@/store/authStore";
import { showLoginAlert } from "@/utils/alert";

export default function TabLayout() {
  const {
    data: notificationCount,
    isLoading,
    isError,
  } = useNotificationCount();
  const navigation = useNavigation();
  const pathname = usePathname();
  const colorScheme = useColorScheme();

  const isAboutBusiness = pathname.startsWith("/subcategory/aboutBusiness");
  const isAuthenticated = useAuthStore((state) => state.authenticated);
  const clearToken = useAuthStore((state) => state.clearToken);

  if (isLoading) {
    return <Loading position="center" />;
  }

  if (isError) {
    return <SomethingWrong />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].primary,
        headerShown: true,
        tabBarStyle: isAboutBusiness ? { display: "none" } : {},
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "",
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
          headerShown: false,
          headerLeft: () => (
            <View className="flex-row items-center">
            </View>
          ),
          headerRight: () => (
            <View className="flex-row gap-4 mr-4">
              <Pressable
                onPress={() => {
                  if (!isAuthenticated) {
                    showLoginAlert({
                      message: "Need to login to access your chat sessions",
                      onConfirm: () => {
                        clearToken();
                        router.navigate("/(root)/profile");
                      },
                    });
                  } else {
                    router.navigate("/chatSessions");
                  }
                }}
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={20}
                  color={Colors[colorScheme ?? "light"].secondary}
                />
              </Pressable>

              <Pressable
                onPress={() => {
                  if (!isAuthenticated) {
                    Alert.alert(
                      "Login Required",
                      "You need to login to use favorites feature",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Login",
                          onPress: () => {
                            clearToken();
                            router.navigate("/(root)/profile");
                          },
                        },
                      ],
                    );
                  } else {
                    router.navigate("/favorite");
                  }
                }}
              >
                <Ionicons
                  name="heart-outline"
                  size={20}
                  color={Colors[colorScheme ?? "light"].secondary}
                />
              </Pressable>

              <Pressable
                onPress={() => {
                  if (!isAuthenticated) {
                    Alert.alert(
                      "Login Required",
                      "Need to login to view notifications",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Login",
                          onPress: () => {
                            clearToken();
                            router.replace("/(root)/profile");
                          },
                        },
                      ],
                    );
                  } else {
                    router.push("/notification");
                  }
                }}
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color={Colors[colorScheme ?? "light"].secondary}
                  />
                  {!!notificationCount?.unread_count && (
                    <Text className="text-white bg-red-500 px-1 text-xs rounded-full ml-1">
                      {notificationCount.unread_count.toString()}
                    </Text>
                  )}
                </View>
              </Pressable>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="(hire)"
        options={{
          headerShown: false,
          title: "Hire",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* -------------------- OFFERS TAB -------------------- */}
      <Tabs.Screen
        name="(offer)/allOffers"
        options={{
          title: "Offers",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="pricetag-outline" size={24} color={color} />
          ),
        }}
      />

      {/* -------------------- PROFILE TAB -------------------- */}
      <Tabs.Screen
        name="profile"
        options={{
          title: isAuthenticated ? "Profile" : "Login",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
