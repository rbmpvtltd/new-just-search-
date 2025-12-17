import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, View } from "react-native";
import { useAuthStore } from "@/features/auth/authStore";
import CreateHireListing from "@/features/hire/create/add-hire";
import MyHireCard from "@/features/hire/show/MyHire";
import { trpc } from "@/lib/trpc";

export default function MyHireListing() {
  const getAuthStoreToken = useAuthStore((state) => state.token);

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
