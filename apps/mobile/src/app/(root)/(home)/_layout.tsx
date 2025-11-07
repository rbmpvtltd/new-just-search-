import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}> 
      <Stack.Screen name='subcategory' options={{ headerShown : false }} />
      <Stack.Screen name='home' options={{ headerShown : false }} />
    </Stack>
  );
}