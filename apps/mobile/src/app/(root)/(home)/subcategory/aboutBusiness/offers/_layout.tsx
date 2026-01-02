import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="singleOffers"
        options={{ headerShown: true, title: "Offers" }}
      />
    </Stack>
  );
}
