import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="[subcategory]" options={{ title: "All Listings" }} />
      <Stack.Screen name="aboutbusiness" options={{ headerShown: false }} />
    </Stack>

    // <Stack screenOptions={{ headerShown: true }}>
    //   <Stack.Screen name="index" options={{ title: "Profile" }} />
    //   <Stack.Screen
    //     name="subcategory/[subcategory]"
    //     options={{
    //       // headerLeft: () => <DrawerMenu />,
    //       title: "Hire Listing",
    //     }}
    //   />
    //   <Stack.Screen
    //     name="hire/edit/[id]"
    //     options={{
    //       // headerLeft: () => <DrawerMenu />,
    //       title: "Edit Hire Listing",
    //     }}
    //   />
    // </Stack>
  );
}
