import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { Alert, useColorScheme } from "react-native";
import { PROFILE_URL } from "@/constants/apis";
import Colors from "@/constants/Colors";
import { useSuspenceData } from "@/query/getAllSuspense";
import useBusinessFormValidationStore from "@/store/businessFormStore";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const page = useBusinessFormValidationStore((state) => state.page);
  const { data, isLoading, isError } = useSuspenceData(
    PROFILE_URL.url,
    PROFILE_URL.key,
  );

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
          title: "Business Details",
          headerShown: false,
          tabBarLabel: "Business Details",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={color}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            const isAllowed = page >= 0;

            if (!isAllowed) {
              e.preventDefault();
              // Alert.alert(
              //   "Access Denied:",
              //   "Please complete Business Details and click Next to continue.",
              // );
              console.log("Access Denied: Previous form not completed.");
            }
          },
        })}
      />
      <Tabs.Screen
        name="addressDetail"
        options={{
          headerShown: false,
          title: "Address Detail",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="analytics-outline"
              size={24}
              color={page >= 1 ? color : "gray"}
            />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            const isAllowed = page >= 1;

            if (!isAllowed) {
              e.preventDefault();
              Alert.alert(
                "Access Denied",
                "Please complete Business Details and click Next to continue.",
              );
              console.log("Access Denie: Previous form not completed.");
            }
          },
        })}
      />
      <Tabs.Screen
        name="bussinessTiming"
        options={{
          headerShown: false,
          title: "Bussiness Timing",
          tabBarIcon: ({ color }) => (
            <Ionicons name="hourglass-outline" size={24} color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            const isAllowed = page >= 2;

            if (!isAllowed) {
              e.preventDefault();
              Alert.alert(
                "Access Denied",
                "Please complete Address Detail and click Next to continue.",
              );
              console.log("Access Denied: Previous form not completed.");
            }
          },
        })}
      />
      <Tabs.Screen
        name="contactDetail"
        options={{
          headerShown: false,
          title: "Contact Detail",
          tabBarIcon: ({ color }) => (
            <Ionicons name="paper-plane-outline" size={24} color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            const isAllowed = page >= 3;

            if (!isAllowed) {
              e.preventDefault();
              Alert.alert(
                "Access Denied",
                "Please complete Bussiness Timing and click Next to continue.",
              );
              console.log("Access Denied: Previous form not completed.");
            }
          },
        })}
      />
    </Tabs>
  );
}
