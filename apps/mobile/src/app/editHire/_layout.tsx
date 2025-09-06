import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs, useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import useFormValidationStore from "@/store/formHireStore";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const page = useFormValidationStore((state) => state.page);
  const { editHire } = useLocalSearchParams();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].primary,
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="[editHire]"
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
        initialParams={{ editHire: editHire }}
        // listeners={({ navigation }) => ({
        //   tabPress: (e) => {
        //     router.navigate({
        //       pathname: "/editHire/[editHire]",
        //       params: { editHire: editHire as string },
        //     });
        //     // const isAllowed = page >= 0;

        //     // if (!isAllowed) {
        //     //   e.preventDefault();
        //     //   Alert.alert("Access Denied: Previous form not completed.");
        //     //   console.log("Access Denied: Previous form not completed.");
        //     // }
        //   },
        // })}
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
        initialParams={{ editHire: editHire }}
        // listeners={({ navigation }) => ({
        //   tabPress: (e) => {
        //     router.navigate({
        //       pathname: "/editHire/qualificationsAndSkills",
        //       params: { editHire: editHire },
        //     });
        //     // const isAllowed = page >= 1;
        //     // if (!isAllowed) {
        //     //   e.preventDefault();
        //     //   Alert.alert("Please click on the next button");
        //     //   console.log("Access Denie: Previous form not completed.");
        //     // }
        //   },
        // })}
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
        initialParams={{ editHire: editHire }}
        // listeners={({ navigation }) => ({
        //   tabPress: (e) => {
        //     router.navigate({
        //       pathname: "/editHire/preferredProfession",
        //       params: { editHire: editHire },
        //     });
        //     // const isAllowed = page >= 2;
        //     // if (!isAllowed) {
        //     //   e.preventDefault();
        //     //   Alert.alert("Please click on the next button");
        //     //   console.log("Access Denied: Previous form not completed.");
        //     // }
        //   },
        // })}
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
        initialParams={{ editHire: editHire }}
        // listeners={({ navigation }) => ({
        //   tabPress: (e) => {
        //     router.navigate({
        //       pathname: "/editHire/attachments",
        //       params: { editHire: editHire },
        //     });
        //     // const isAllowed = page >= 3;
        //     // if (!isAllowed) {
        //     //   e.preventDefault();
        //     //   Alert.alert("Please click on the next button");
        //     //   console.log("Access Denied: Previous form not completed.");
        //     // }
        //   },
        // })}
      />
    </Tabs>
  );
}
