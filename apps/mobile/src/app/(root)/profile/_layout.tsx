import { Stack } from "expo-router";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";

export default function ProfileLayout() {
  return (
    <BoundaryWrapper>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: "Profile" }} />
      </Stack>
    </BoundaryWrapper>
  );
}
