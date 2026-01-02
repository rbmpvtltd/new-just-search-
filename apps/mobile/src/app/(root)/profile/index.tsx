import { ScrollView, View } from "react-native";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import { useAuthStore } from "@/features/auth/authStore";
import LoginComponent from "@/features/auth/components/LoginComponent";
import { MyProfile } from "@/features/profile/MyProfile";

export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.authenticated);
  console.log("Is Authenticated", isAuthenticated);

  return (
    <BoundaryWrapper>
      <ScrollView>
        <View className="flex-1 items-center justify-center rounded-3xl w-full">
          {!isAuthenticated ? <LoginComponent /> : <MyProfile />}
        </View>
      </ScrollView>
    </BoundaryWrapper>
  );
}
