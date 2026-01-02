import Logout from "@/features/auth/Logout";
import { Stack } from "expo-router";

export default function index() {
  return (
    <>
      {/* <Stack.Screen
        name="logout/index"
        options={{
          title: "Logout",
        }}
      /> */}
      <Logout />
    </>
  );
}
