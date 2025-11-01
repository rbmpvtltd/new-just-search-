// import DrawerLayout from "@/components/layout/Drawer";
// import { useLoadToken } from "@/hooks/useLoadToken";
// import { useAuthStore } from "@/store/authStore";
// import { UserRole } from "@repo/db/src/schema/auth.schema";

// export default function HomeLayout() {
//   const { token, role } = useLoadToken();
//     const setAuthStoreToken = useAuthStore((state) => state.setToken);
//     console.log("token in layout.tsx line no 8",token,role)
//     setAuthStoreToken(token,role)
//   return <DrawerLayout />;
// }

import DrawerLayout from "@/components/layout/Drawer";
import { useLoadToken } from "@/hooks/useLoadToken";
import { useAuthStore } from "@/store/authStore";
import { UserRole } from "@repo/db/src/schema/auth.schema";
import { useEffect } from "react";

export default function HomeLayout() {
  const { token, role, isLoading } = useLoadToken();
  const setAuthStoreToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    if (token && role) {
      setAuthStoreToken(token, UserRole.admin);
    }
  }, [token, role, setAuthStoreToken]);


  return <DrawerLayout />;
}
