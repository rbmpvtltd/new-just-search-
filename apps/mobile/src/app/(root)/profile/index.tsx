import { useSuspenseQuery } from "@tanstack/react-query";
import { ScrollView, View } from "react-native";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import LoginComponent from "@/features/auth/LoginComponent";
import { MyProfile } from "@/features/profile/MyProfile";
import { trpc } from "@/lib/trpc";

export default function Index() {
  const { data } = useSuspenseQuery(trpc.auth.verifyauth.queryOptions());

  return (
    <BoundaryWrapper>
      <ScrollView>
        <View className="flex-1 items-center justify-center  rounded-3xl w-full ">
          {!data.success ? <LoginComponent /> : <MyProfile />}
        </View>
      </ScrollView>
    </BoundaryWrapper>
  );
}
