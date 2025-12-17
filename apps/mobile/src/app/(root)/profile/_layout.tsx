import { Stack } from "expo-router";

export default function ProfileLayout() {
  return <Stack screenOptions={{ headerShown: false }}>  {/* Optional: Show header for nested screens */}
    <Stack.Screen name='index' options={{ title: 'Profile' }} />
  </Stack>
}
