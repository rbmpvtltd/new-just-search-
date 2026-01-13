import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Pressable } from "react-native";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import UserProfile from "@/features/profile/UserProfile";

export default function EditProfile() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Edit Profile",
          headerLeft: () => (
            <Pressable
              className="ml-2"
              onPress={() => router.replace("/(root)/profile")}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                className="p-2 mr-4 self-center"
              />
            </Pressable>
          ),
        }}
      />
      <BoundaryWrapper>
        <UserProfile />
      </BoundaryWrapper>
    </>
  );
}
