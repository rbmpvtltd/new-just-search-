// import DrawerLayout from "@/components/layout/Drawer";
// import { useLoadToken } from "@/hooks/useLoadToken";
// import { useAuthStore } from "@/store/authStore";
// import { UserRole } from "@repo/db/dist/schema/auth.schema";

// export default function HomeLayout() {
//   const { token, role } = useLoadToken();
//     const setAuthStoreToken = useAuthStore((state) => state.setToken);
//     console.log("token in layout.tsx line no 8",token,role)
//     setAuthStoreToken(token,role)
//   return <DrawerLayout />;
// }

import { Ionicons } from "@expo/vector-icons";
import { UserRole } from "@repo/db/dist/enum/allEnum.enum";
import { useQuery } from "@tanstack/react-query";
import { router, Stack, useSegments } from "expo-router";
import { useEffect } from "react";
import {
  Alert,
  Image,
  Pressable,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { DrawerMenu } from "@/components/layout/Drawer";
import { SomethingWrong } from "@/components/ui/SomethingWrong";
import Colors from "@/constants/Colors";
import { useAuthStore } from "@/features/auth/authStore";
import { useLoadToken } from "@/hooks/useLoadToken";
import { trpc } from "@/lib/trpc";
import { showLoginAlert } from "@/utils/alert";

export default function HomeLayout() {
  const { data, isLoading } = useLoadToken();
  const colorScheme = useColorScheme();
  const setAuthStoreToken = useAuthStore((state) => state.setToken);
  const segment = useSegments();
  const currentRoute = segment.join("/");
  const isAuthenticated = useQuery(trpc.auth.verifyauth.queryOptions());
  const clearToken = useAuthStore((state) => state.clearToken);
  useEffect(() => {
    if (data?.token && data.role) {
      setAuthStoreToken(data.token, data.role);
    }
  }, [data, setAuthStoreToken]);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerLeft: () => (
            <>
              <DrawerMenu />
              {colorScheme === "dark" ? (
                <Image
                  source={require("@/assets/images/Just_Search_Logo_Full_Dark.png")}
                  className="w-32 h-20"
                />
              ) : (
                <Image
                  source={require("@/assets/images/Just_Search_Logo_Full_Light.png")}
                  className="w-[100px] h-[50px]"
                />
              )}
            </>
          ),
          headerRight: () => (
            <View className="flex-row gap-4 mr-4">
              <Pressable
                onPress={() => {
                  if (!isAuthenticated.isSuccess) {
                    showLoginAlert({
                      message: "Need to login to access your chat sessions",
                      onConfirm: () => {
                        clearToken();
                        router.navigate("/(root)/profile");
                      },
                    });
                  } else {
                    router.push("/(root)/(home)/chat");
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
                  if (!isAuthenticated.isSuccess) {
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
                    router.push("/home");
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
                  if (!isAuthenticated.isSuccess) {
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
                    router.push("/(root)/profile/notification");
                  }
                }}
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color={Colors[colorScheme ?? "light"].secondary}
                  />
                  {/* {!!notificationCount?.unread_count && (
                    <Text className="text-white bg-red-500 px-1 text-xs rounded-full ml-1">
                      {notificationCount.unread_count.toString()}
                    </Text>
                  )} */}
                </View>
              </Pressable>
            </View>
          ),
          title: "",
        }}
      />
    </Stack>
  );
}
