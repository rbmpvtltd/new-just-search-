import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, View } from "react-native";
import { useAuthStore } from "@/features/auth/authStore";
import CreateHireListing from "@/features/hire/create/add-hire";
import MyHireCard from "@/features/hire/show/MyHire";
import { trpc } from "@/lib/trpc";
import { BecomeVisitorForm } from "@/features/auth/forms/BecomeVisitor";

export default function MyHireListing() {
  const role = useAuthStore(state => state.role)
  const getAuthStoreToken = useAuthStore((state) => state.token);
  if(role === "guest"){
      return (
        <BecomeVisitorForm />
      )
    }

  return <View>{getAuthStoreToken ? <MyHire /> : <CreateHireListing />}</View>;
}

function MyHire() {
  const { data, error, isLoading, isError } = useQuery(
    trpc.hirerouter.show.queryOptions(),
  );
  if (isLoading)
    return (
      <View className="flex-1 items-center justify-center py-10">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  if (!data) return <CreateHireListing />;
  return <MyHireCard data={data} />;
}
