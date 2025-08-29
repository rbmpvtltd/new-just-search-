import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { Alert, Pressable, Text, useColorScheme } from "react-native";
import { PROFILE_URL } from "@/constants/apis";
import Colors from "@/constants/Colors";
import { useSuspenceData } from "@/query/getAllSuspense";
import useFormValidationStore from "@/store/formHireStore";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const page = useFormValidationStore((state) => state.page);

  const { data: userProfile } = useSuspenceData(
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
          title: "Personal Details",
          headerShown: false,
          tabBarLabel: "Personal Details",
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
              Alert.alert(
                "Complete the Personal Details form and click Next to move to Qualifications & Skills.",
              );
              console.log("Access Denied: Previous form not completed.");
            }
          },
        })}
      />
      <Tabs.Screen
        name="qualificationsAndSkills"
        options={{
          headerShown: false,
          title: "Qualifications & Skills",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="list-outline"
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
                "Complete the Qualifications & Skills form and click Next to move to Preferred Profession.",
              );
              console.log("Access Denie: Previous form not completed.");
            }
          },
        })}
      />
      <Tabs.Screen
        name="preferredProfession"
        options={{
          headerShown: false,
          title: "Preferred Profession",
          tabBarIcon: ({ color }) => (
            <Ionicons name="cart-outline" size={24} color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            const isAllowed = page >= 2;

            if (!isAllowed) {
              e.preventDefault();
              Alert.alert(
                "Complete the Preferred Profession form and click Next to move to Attachments.",
              );
              console.log("Access Denied: Previous form not completed.");
            }
          },
        })}
      />
      <Tabs.Screen
        name="attachments"
        options={{
          headerShown: false,
          title: "Attachments",
          tabBarIcon: ({ color }) => (
            <Ionicons name="attach-outline" size={24} color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            const isAllowed = page >= 3;

            if (!isAllowed) {
              e.preventDefault();
              Alert.alert(
                "Complete the Attachments form and click Next to move to Business Details.",
              );
              console.log("Access Denied: Previous form not completed.");
            }
          },
        })}
      />
    </Tabs>
  );
}
