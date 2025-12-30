import { Stack } from "expo-router";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";

export default function ProfileLayout() {
  return (
    <BoundaryWrapper>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="business" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="hire" options={{ headerShown: false }} />
      </Stack>
    </BoundaryWrapper>
  );
}
