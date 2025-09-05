import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      {/* Default drawer items (shows drawer1, drawer2, etc.) */}
      <DrawerItemList {...props} />

      {/* Custom drawer item with custom logic */}
      <DrawerItem
        label="Home"
        onPress={() => {
          console.log("Custom action home navigation");
          router.navigate("/(root)/(home)/home");
        }}
      />
      <DrawerItem
        label="Profile"
        onPress={() => {
          console.log("Custom action profile navigation");
          router.navigate("/(root)/profile/profile");
        }}
      />
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
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
    ></Drawer>
  );
}
