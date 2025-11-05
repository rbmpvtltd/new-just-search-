import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>  {/* Optional: Show header for nested screens */}
      <Stack.Screen name='subcategory/[subcategory]' options={{ headerShown : false }} />
    </Stack>
  );
}