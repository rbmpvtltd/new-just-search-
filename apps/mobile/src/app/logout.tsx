import { useQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { Loading } from "@/components/ui/Loading";
import { useAuthStore } from "@/store/authStore";
import { deleteTokenRole } from "@/utils/secureStore";

export default function Logout() {
  const authStore = useAuthStore((state) => state.clearToken);
  //TODO: logout form backend also
  const { isLoading } = useQuery({
    queryKey: ["logout"],
    queryFn: async () => {
      authStore();
      await deleteTokenRole();
      return true;
    },
  });
  if (isLoading) {
    return <Loading position="center" />;
  }

  return <Redirect href="/" />;
}
