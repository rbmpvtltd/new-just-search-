import {
  type DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerToggleButton,
} from "@react-navigation/drawer";
import type { HeaderBackButtonProps } from "@react-navigation/elements";
import { type Href, router, useSegments } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Text, View } from "react-native";

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
    name: "profile",
    route: "/(root)/profile/profile",
  },
  {
    name: "logout",
    route: "/logout",
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

  route: Href;
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const segment = useSegments();
  const currentRoute = segment.join("/");
  return (
    <DrawerContentScrollView {...props}>
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
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const segment = useSegments();
  const currentRoute = segment.join("/");
  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1e293b", // dark slate color
        },
        headerTintColor: "#fff", // text/icon color
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      {drawerFields
        .filter((field) => {
          return `/${currentRoute}` === field.route;
        })
        .map((field) => {
          return (
            <Drawer.Screen
              name={field.name}
              key={field.key ?? field.name}
              options={{
                title: field.title ?? field.name,
                headerLeft: (props) => (
                  <>
                    {/* Default back button */}
                    <DrawerToggleButton {...props} />

                    {/* Your custom headerLeft addition */}
                    {field.headerLeft ? field.headerLeft(props) : null}
                  </>
                ),
              }}
            />
          );
        })}
    </Drawer>
  );
}
