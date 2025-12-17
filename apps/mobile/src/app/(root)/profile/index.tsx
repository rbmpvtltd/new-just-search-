import { useSuspenseQuery } from "@tanstack/react-query";
import { ScrollView, View } from "react-native";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import BusinessHireLoginComponent from "@/features/auth/components/LoginComponent";
import { MyProfile } from "@/features/profile/MyProfile";
import { useAuthStore } from "@/store/authStore";

export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.authenticated);
  return (
    <BoundaryWrapper>
      <ScrollView>
        <View className="flex-1 items-center justify-center  rounded-3xl w-full ">
          {!isAuthenticated ? <BusinessHireLoginComponent /> : <MyProfile />}
        </View>
      </ScrollView>
    </BoundaryWrapper>
  );
}
