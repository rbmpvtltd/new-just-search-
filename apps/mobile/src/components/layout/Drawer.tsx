import { DrawerItem } from "@react-navigation/drawer";
import type { HeaderBackButtonProps } from "@react-navigation/elements";
import { type Href, router, useSegments } from "expo-router";
import { useState } from "react";
import { Button, Text, View } from "react-native";
import { Drawer } from "react-native-drawer-layout";

const drawerFields: DrawerField[] = [
  {
    name: "home",
    route: "/(root)/(home)/home",
    title: "hi",
    headerLeft: () => {
      return (
        <View className="p-4 bg-primary">
          <Text className="text-secondary"> hi</Text>
        </View>
      );
    },
  },
  {
    name: "Profile",
    route: "/(root)/profile",
  },
  {
    name: "Hire Listings",
    route: "/(root)/profile/hire",
  },
  {
    name: "Business Listings",
    route: "/(root)/profile/business",
  },
  {
    name: "My Offers",
    route: "/(root)/profile/offer",
  },
  {
    name: "Add Offer",
    route: "/(root)/profile/offer/add",
  },
  {
    name: "Add Product",
    route: "/(root)/profile/product/add",
  },
  {
    name: "My Products",
    route: "/(root)/profile/product",
  },
  {
    name: "Pricing Plans",
    route: "/(root)/profile/plans",
  },
  {
    name: "Request to Delete Account",
    route: "/(root)/profile/account-delete-request",
  },
  {
    name: "Feedback",
    route: "/(root)/profile/feedback",
  },
  {
    name: "Help and Support",
    route: "/(root)/profile/help-and-support",
  },
  {
    name: "Terms & Conditions",
    route: "/(root)/profile/terms-and-conditions",
  },
  {
    name: "Logout",
    route: "/(root)/profile/logout",
  },
];

interface DrawerField {
  name: string;
  key?: string;
  title?: string;
  headerLeft?:
    | ((
        props: HeaderBackButtonProps & {
          canGoBack?: boolean;
        },
      ) => React.ReactNode)
    | undefined;
  headerRight?:
    | ((
        props: HeaderBackButtonProps & {
          canGoBack?: boolean;
        },
      ) => React.ReactNode)
    | undefined;

  route: Href;
}

function CustomDrawerContent() {
  const segment = useSegments();
  const currentRoute = segment.join("/");
  return (
    <View>
      {drawerFields.map((field) => {
        const isFocused = `/${currentRoute}` === field.route;
        return (
          <DrawerItem
            key={field.key ?? field.name}
            label={field.name}
            activeTintColor="#ff2"
            focused={isFocused}
            onPress={() => {
              router.navigate(field.route);
            }}
          />
        );
      })}
    </View>
  );
}

export function DrawerMenu() {
  const [open, setOpen] = useState(false);
  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderDrawerContent={() => <CustomDrawerContent />}
    >
      <Button
        onPress={() => setOpen((prevOpen) => !prevOpen)}
        title={`${open ? "Close" : "Open"}`}
      />
    </Drawer>
  );
}
