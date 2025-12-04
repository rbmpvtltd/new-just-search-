// import DrawerLayout from "@/components/layout/Drawer";
// import { useLoadToken } from "@/hooks/useLoadToken";
// import { useAuthStore } from "@/store/authStore";
// import { UserRole } from "@repo/db/dist/schema/auth.schema";

// export default function HomeLayout() {
//   const { token, role } = useLoadToken();
//     const setAuthStoreToken = useAuthStore((state) => state.setToken);
//     console.log("token in layout.tsx line no 8",token,role)
//     setAuthStoreToken(token,role)
//   return <DrawerLayout />;
// }

import { UserRole } from "@repo/db/dist/enum/allEnum.enum";
import { useEffect } from "react";
import { SafeAreaView } from "react-native";
import DrawerLayout from "@/components/layout/Drawer";
import { useLoadToken } from "@/hooks/useLoadToken";
import { useAuthStore } from "@/store/authStore";

export default function HomeLayout() {
  const { data, isLoading } = useLoadToken();
  const setAuthStoreToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    if (data?.token && data.role) {
      setAuthStoreToken(data.token, UserRole.admin);
    }
  }, [data, setAuthStoreToken]);

  return <DrawerLayout />;
}
