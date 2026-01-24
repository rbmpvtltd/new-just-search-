import { Stack } from "expo-router";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import { DrawerMenu } from "@/components/layout/Drawer";
import { useAuthStore } from "@/features/auth/authStore";

export default function ProfileLayout() {
  const authenticated = useAuthStore((state) => state.authenticated);

  return (
    <BoundaryWrapper>
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen
          name="index"
          options={{
            headerLeft: () => <DrawerMenu />,
            title: authenticated ? "Profile" : "Log In",
          }}
        />

        <Stack.Screen
          name="hire/index"
          options={{
            // headerLeft: () => <DrawerMenu />,
            title: "Hire Listing",
          }}
        />
        <Stack.Screen
          name="hire/edit/[id]"
          options={{
            // headerLeft: () => <DrawerMenu />,
            title: "Edit Hire Listing",
          }}
        />

        <Stack.Screen
          name="business/index"
          options={{
            // headerLeft: () => <DrawerMenu />,
            title: "Business Listing",
          }}
        />
        <Stack.Screen
          name="business/edit/[id]"
          options={{
            // headerLeft: () => <DrawerMenu />,
            title: "Edit Business Listing",
          }}
        />
        <Stack.Screen
          name="offer/index"
          options={{
            title: "My Offers",
          }}
        />
        <Stack.Screen
          name="offer/add/index"
          options={{
            title: "Add Offers",
          }}
        />
        <Stack.Screen
          name="offer/edit/[id]"
          options={{
            // headerLeft: () => <DrawerMenu />,
            title: "Edit Offer",
          }}
        />
        <Stack.Screen
          name="product/add/index"
          options={{
            title: "Add Product",
          }}
        />
        <Stack.Screen
          name="product/edit/[id]"
          options={{
            // headerLeft: () => <DrawerMenu />,
            title: "Edit Product",
          }}
        />
        <Stack.Screen
          name="product/index"
          options={{
            title: "My Products",
          }}
        />
        <Stack.Screen
          name="plans/index"
          options={{
            title: "Pricing Plans",
          }}
        />
        <Stack.Screen
          name="account-delete-request/index"
          options={{
            title: "Delete Account Request",
          }}
        />
        <Stack.Screen name="feedback/index" options={{ title: "Feedback" , }} />
        <Stack.Screen
          name="help-and-support/index"
          options={{
            title: "My Tokens",
          }}
        />
        <Stack.Screen
          name="terms-and-conditions/index"
          options={{
            title: "Terms and Conditions",
          }}
        />
        <Stack.Screen
          name="privacy-policy/index"
          options={{
            title: "Privacy Policy",
          }}
        />
        <Stack.Screen
          name="logout/index"
          options={{
            title: "Logout",
          }}
        />
      </Stack>
    </BoundaryWrapper>
  );
}
