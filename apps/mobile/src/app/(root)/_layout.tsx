import Ionicons from "@expo/vector-icons/Ionicons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Link, router, Tabs } from "expo-router";
import { Alert, Image, Text, useColorScheme, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import { useAuthStore } from "@/store/authStore";
import { showLoginAlert } from "@/utils/alert";
import { Loading } from "@/components/ui/Loading";
import { SomethingWrong } from "@/components/ui/SomethingWrong";
import { useNotificationCount } from "@/query/notification/notication";

export default function TabLayout() {
  const { data: noticationcount, isLoading, isError } = useNotificationCount();
  const navigation = useNavigation();

  const colorScheme = useColorScheme();
  const isAuthenticated = useAuthStore((state) => state.authenticated);
  const clearToken = useAuthStore((state) => state.clearToken);

  if (isLoading) {
    return <Loading position="center" />;
  }

  if (isError) <SomethingWrong />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].primary,
        headerShown: true,
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
          headerLeft: () => {
            return (
              <View className="flex-row items-center">
                {/* {isAuthenticated && ( */}
                {/*   <Pressable */}
                {/*     onPress={() => { */}
                {/*       console.log("clicked on drawer hamburger"); */}
                {/*       navigation.dispatch(DrawerActions.openDrawer()); */}
                {/*     }} */}
                {/*     style={{ marginRight: 10, marginLeft: 10 }} */}
                {/*   > */}
                {/*     <Ionicons */}
                {/*       name="menu-outline" */}
                {/*       size={28} */}
                {/*       color={Colors[colorScheme ?? "light"].secondary} */}
                {/*     /> */}
                {/*   </Pressable> */}
                {/* )} */}
                {/* <Link href="/(root)/(home)/home" asChild> */}
                {/*   {colorScheme === "dark" ? ( */}
                {/*     <Image */}
                {/*       source={require("@/assets/images/Just_Search_Logo_Full_Dark.png")} */}
                {/*       width={300} */}
                {/*       height={10} */}
                {/*     /> */}
                {/*   ) : ( */}
                {/*     <Image */}
                {/*       source={require("@/assets/images/Just_Search_Logo_Full_Light.png")} */}
                {/*       width={300} */}
                {/*       height={10} */}
                {/*     /> */}
                {/*   )} */}
                {/* </Link> */}
              </View>
            );
          },
          headerRight: () => (
            <View className="flex-row gap-4 mr-4">
              <Pressable
                onPress={() => {
                  if (!isAuthenticated) {
                    showLoginAlert({
                      message: "Need to login to access your chat sessions",
                      onConfirm: () => {
                        clearToken();
                        router.navigate("/(root)/profile/profile");
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
                      "Login Required ",
                      "Need to login for use favorite feature",
                      [
                        {
                          text: "No Thanks",
                          style: "cancel",
                        },
                        {
                          text: "",
                          style: "destructive",
                          onPress: () => {
                            clearToken();
                            router.navigate("/(root)/profile/profile");
                          },
                        },
                      ],
                      { cancelable: false },
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
                      "Login Required ",
                      "Need to login for start chatting on your behalf",
                      [
                        {
                          text: "No Thanks",
                          style: "cancel",
                        },
                        {
                          text: "",
                          style: "destructive",
                          onPress: () => {
                            clearToken();
                            router.replace("/(root)/profile/profile");
                          },
                        },
                      ],
                      { cancelable: false },
                    );
                  } else {
                    router.push("/notification");
                  }
                }}
              >
                <View className="flex-row">
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color={Colors[colorScheme ?? "light"].secondary}
                  />
                  {!!noticationcount.unread_count && (
                    <Text className="text-secondary bg-error px-1 text-xs h-4 rounded-full">
                      {noticationcount.unread_count.toString()}
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
      <Tabs.Screen
        name="profile"
        options={{
          title: isAuthenticated ? "Profile" : "Login",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
      
      {/* <Tabs.Screen */}
      {/*   name="" */}
      {/*   options={{ */}
      {/*     tabBarItemStyle: { */}
      {/*       display: "none", */}
      {/*     }, */}
      {/*     headerShown: false, */}
      {/*     title: "Profile Detail", */}
      {/*     tabBarIcon: ({ color }) => ( */}
      {/*       <Ionicons */}
      {/*         name="information-circle-outline" */}
      {/*         size={24} */}
      {/*         color={color} */}
      {/*       /> */}
      {/*     ), */}
      {/*   }} */}
      {/* /> */}
    </Tabs>
  );
}
