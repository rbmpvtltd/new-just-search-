import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}> 
      <Stack.Screen name='singleOffers' options={{ headerShown : true }} />
    </Stack>
  );
}