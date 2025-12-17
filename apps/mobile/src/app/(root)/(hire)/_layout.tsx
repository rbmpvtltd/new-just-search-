import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>  {/* Optional: Show header for nested screens */}
      <Stack.Screen name='hire' options={{ title: 'Hire' }} />
      {/* <Stack.Screen name='hireDetail/[hiredetails]' options={{ title: 'hireDetail' }} /> */}
    </Stack>
  );
}