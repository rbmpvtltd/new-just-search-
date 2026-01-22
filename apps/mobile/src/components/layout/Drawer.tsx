import { Ionicons } from "@expo/vector-icons";
import type { HeaderBackButtonProps } from "@react-navigation/elements";
import type { UserRole } from "@repo/db";
import { type Href, router, useSegments } from "expo-router";
import { Image, Pressable, Text, useColorScheme, View } from "react-native";
import { fi } from "zod/v4/locales";
import { create } from "zustand";
import Colors from "@/constants/Colors";
import { useAuthStore } from "@/features/auth/authStore";

type DrawerStore = {
  open: boolean;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
};

export const useDrawerStore = create<DrawerStore>((set) => ({
  open: false,
  toggleOpen: () => set((state) => ({ open: !state.open })),
  setOpen: (open: boolean) => set({ open }),
}));

const drawerFields: DrawerField[] = [
  {
    name: "Home",
    route: "/(root)/(home)/home",
    title: "hi",
    headerRight: () => {
      return (
        <View className="p-4 bg-primary">
          <Text className="text-secondary"> hi</Text>
        </View>
      );
    },
    icon: "home-outline",
    role: "all",
  },
  {
    name: "Profile",
    route: "/(root)/profile",
    icon: "person-circle-outline",
    role: "all",
  },
  {
    name: "Hire Listing",
    route: "/(root)/profile/hire",
    icon: "briefcase-outline",
    role: ["hire", "visiter", "guest"],
  },
  {
    name: "Business Listing",
    route: "/(root)/profile/business",
    icon: "business-outline",
    role: ["business", "visiter", "guest"],
  },
  {
    name: "My Offers",
    route: "/(root)/profile/offer",
    icon: "gift-outline",
    role: "business",
  },
  {
    name: "Add Offer",
    route: "/(root)/profile/offer/add",
    icon: "add-circle-outline",
    role: "business",
  },
  {
    name: "Add Product",
    route: "/(root)/profile/product/add",
    icon: "add-circle-outline",
    role: "business",
  },
  {
    name: "My Products",
    route: "/(root)/profile/product",
    icon: "cube-outline",
    role: "business",
  },
  {
    name: "Pricing Plans",
    route: "/(root)/profile/plans",
    icon: "cash-outline",
    role: "all",
  },
  {
    name: "Request to Delete Account",
    route: "/(root)/profile/account-delete-request",
    icon: "trash-outline",
    role: ["visiter", "guest", "hire", "business"],
  },
  {
    name: "Feedback",
    route: "/(root)/profile/feedback",
    icon: "chatbox-ellipses-outline",
    role: ["visiter", "guest", "hire", "business"],
  },
  {
    name: "Help and Support",
    route: "/(root)/profile/help-and-support",
    icon: "help-circle-outline",
    role: ["visiter", "guest", "hire", "business"],
  },
  {
    name: "Terms & Conditions",
    route: "/(root)/profile/terms-and-conditions",
    icon: "document-text-outline",
    role: "all",
  },
  {
    name: "Logout",
    route: "/(root)/profile/logout",
    icon: "log-out-outline",
    role: "all",
    authenticated: true,
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
  icon?: keyof typeof Ionicons.glyphMap;
  role?: UserRole[] | UserRole;
  authenticated?: boolean;
}

export function CustomDrawerContent() {
  const colorScheme = useColorScheme();
  const segment = useSegments();
  const currentRoute = segment.join("/");
  const toggleOpen = useDrawerStore((state) => state.toggleOpen);
  let role = useAuthStore((s) => s.role);
  const authenticated = useAuthStore((s) => s.authenticated);

  if (!role) {
    role = "all";
  }

  const items = drawerFields.filter(
    (item) =>
      (item?.role?.includes(role) || item?.role === "all") &&
      (!item?.authenticated || authenticated),
  );
  return (
    // <View>
    //   {drawerFields.map((field) => {
    //     const isFocused = `/${currentRoute}` === field.route;
    //     return (
    //       <Pressable
    //         key={field.key ?? field.name}
    //         className={`${isFocused ? "bg-primary" : ""}`}
    //         onPress={() => router.navigate(field.route)}
    //       >
    //         <Text>{field.name}</Text>
    //       </Pressable>
    //     );
    //   })}
    // </View>
    <View
      className="flex-1 bg-base-100 px-3 pt-6 "
      style={{ backgroundColor: Colors[colorScheme ?? "light"]["base-100"] }}
    >
      {items.map((field) => {
        const isFocused = `/${currentRoute}` === field.route;
        return (
          <Pressable
            key={field.key ?? field.name}
            onPress={() => {
              toggleOpen();
              router.navigate(field.route);
            }}
            className={`flex-row items-center gap-3 rounded-xl px-4 py-3 mb-2
              ${isFocused ? "bg-primary-content" : "active:bg-base-200"}
            `}
          >
            {isFocused && (
              <View className="absolute left-0 h-6 w-1 rounded-r-full bg-primary" />
            )}

            {field.icon && (
              <Ionicons
                name={field.icon}
                size={20}
                color={
                  isFocused
                    ? Colors[colorScheme ?? "light"]["primary"]
                    : Colors[colorScheme ?? "light"]["secondary"]
                }
              />
            )}

            <Text
              style={{
                color: isFocused
                  ? Colors[colorScheme ?? "light"].primary
                  : Colors[colorScheme ?? "light"]["secondary-content"],
                fontWeight: "500",
                fontSize: 16,
              }}
            >
              {field.name === "Profile" && !authenticated
                ? "Log In"
                : field.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// key={field.key ?? field.name}
// label={field.name}
// activeTintColor="#ff2"
// focused={isFocused}
// onPress={() => {
//   router.navigate(field.route);
// }}
//  />

export function DrawerMenu() {
  const colorScheme = useColorScheme();
  const toggleOpen = useDrawerStore((state) => state.toggleOpen);
  return (
    <Pressable onPress={() => toggleOpen()} className="">
      <Ionicons
        name="menu"
        size={32}
        color={Colors[colorScheme ?? "light"].secondary}
        onPress={() => toggleOpen()}
      />
    </Pressable>
  );
  // <Button  onPress={() => toggleOpen()} title={`Menu`} />;
}
