import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs, useLocalSearchParams } from "expo-router";
import { Pressable, Text, useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import useFormValidationStore from "@/store/formHireStore";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const page = useFormValidationStore((state) => state.page);

  const { editBusiness } = useLocalSearchParams();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].primary,
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="[editBusiness]"
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
        initialParams={{ editBusiness: editBusiness }}
      />
      <Tabs.Screen
        name="editAddressDetail"
        options={{
          headerShown: false,
          title: "Edit Address",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="analytics-outline"
              size={24}
              color={page >= 1 ? color : "gray"}
            />
          ),
        }}
        initialParams={{ editBusiness: editBusiness }}
      />
      <Tabs.Screen
        name="editBusinessTiming"
        options={{
          headerShown: false,
          title: "Edit Timing",
          tabBarIcon: ({ color }) => (
            <Ionicons name="hourglass-outline" size={24} color={color} />
          ),
        }}
        initialParams={{ editBusiness: editBusiness }}
      />
      <Tabs.Screen
        name="editContactDetail"
        options={{
          headerShown: false,
          title: "Edit Contact",
          tabBarIcon: ({ color }) => (
            <Ionicons name="paper-plane-outline" size={24} color={color} />
          ),
        }}
        initialParams={{ editBusiness: editBusiness }}
      />
    </Tabs>
  );
}
