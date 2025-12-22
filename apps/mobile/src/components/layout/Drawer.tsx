import { Ionicons } from "@expo/vector-icons";
import {
  type DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerToggleButton,
} from "@react-navigation/drawer";
import type { HeaderBackButtonProps } from "@react-navigation/elements";
import { useQuery } from "@tanstack/react-query";
import { type Href, router, useSegments } from "expo-router";
import { Drawer } from "expo-router/drawer";
import {
  Alert,
  Image,
  Pressable,
  Text,
  useColorScheme,
  View,
} from "react-native";
import Colors from "@/constants/Colors";
import { useAuthStore } from "@/features/auth/authStore";
import { trpc } from "@/lib/trpc";
import { useNotificationCount } from "@/query/notification/notication";
import { showLoginAlert } from "@/utils/alert";
import { Loading } from "../ui/Loading";
import { SomethingWrong } from "../ui/SomethingWrong";

const drawerFields: DrawerField[] = [
  {
    name: "home",
    route: "/(root)/(home)/home",
    title: "hi",
    headerLeft: () => {
      return (
        <View className="p-4 bg-primary">
          <Text className="text-secondary"> hi</Text>
        </View>
      );
    },
  },
  {
    name: "Profile",
    route: "/(root)/profile",
  },
  {
    name: "Hire Listings",
    route: "/(root)/profile/hire",
  },
  {
    name: "Business Listings",
    route: "/(root)/profile/business",
  },
  {
    name: "My Offers",
    route: "/(root)/profile/offer",
  },
  {
    name: "Add Offer",
    route: "/(root)/profile/offer/add",
  },
  {
    name: "Add Product",
    route: "/(root)/profile/product/add",
  },
  {
    name: "My Products",
    route: "/(root)/profile/product",
  },
  {
    name: "Pricing Plans",
    route: "/(root)/profile/plans",
  },
  {
    name: "Request to Delete Account",
    route: "/(root)/profile/account-delete-request",
  },
  {
    name: "Feedback",
    route: "/(root)/profile/feedback",
  },
  {
    name: "Help and Support",
    route: "/(root)/profile/help-and-support",
  },
  {
    name: "Logout",
    route: "/(root)/profile/logout",
  },
];

interface DrawerField {
  name: string;
  key?: string;
  title?: string;
  headerLeft?:
    | ((
        props: HeaderBackButtonProps & {
          canGoBack?: boolean;
        },
      ) => React.ReactNode)
    | undefined;
  headerRight?:
    | ((
        props: HeaderBackButtonProps & {
          canGoBack?: boolean;
        },
      ) => React.ReactNode)
    | undefined;

  route: Href;
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const segment = useSegments();
  const currentRoute = segment.join("/");
  return (
    <DrawerContentScrollView {...props}>
      {drawerFields.map((field) => {
        const isFocused = `/${currentRoute}` === field.route;
        return (
          <DrawerItem
            key={field.key ?? field.name}
            label={field.name}
            activeTintColor="#ff2"
            focused={isFocused}
            onPress={() => {
              router.navigate(field.route);
            }}
          />
        );
      })}
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const {
    data: notificationCount,
    isLoading,
    isError,
  } = useNotificationCount();
  const segment = useSegments();
  const currentRoute = segment.join("/");
  const isAuthenticated = useQuery(trpc.auth.verifyauth.queryOptions());
  const clearToken = useAuthStore((state) => state.clearToken);
  const colorScheme = useColorScheme();
  if (isLoading) {
    return <Loading position="center" />;
  }

  if (isError) {
    return <SomethingWrong />;
  }
  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? "light"]["base-100"],
          // dark slate color
        },
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
                  router.push("/home"); // TODO: add real favorites redirect
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
                {!!notificationCount?.unread_count && (
                  <Text className="text-white bg-red-500 px-1 text-xs rounded-full ml-1">
                    {notificationCount.unread_count.toString()}
                  </Text>
                )}
              </View>
            </Pressable>
          </View>
        ),
        headerLeft: () => (
          <>
            <DrawerToggleButton
              tintColor={Colors[colorScheme ?? "light"].secondary}
            />
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
        headerTitle: "",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
          color: Colors[colorScheme ?? "light"].secondary,
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      {drawerFields
        .filter((field) => {
          return `/${currentRoute}` === field.route;
        })
        .map((field) => {
          return (
            <Drawer.Screen
              name={field.name}
              key={field.key ?? field.name}
              options={{
                headerShown: true, // TODO: do something here
              }}
            />
          );
        })}
    </Drawer>
  );
}
