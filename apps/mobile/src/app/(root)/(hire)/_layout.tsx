import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Optional: Show header for nested screens */}
      <Stack.Screen
        name="hire"
        options={{ title: "All Hires", headerShown: true }}
      />
      {/* <Stack.Screen name='hiredetail/[hiredetails]' options={{ title: 'hireDetail' }} /> */}
    </Stack>
  );
}
