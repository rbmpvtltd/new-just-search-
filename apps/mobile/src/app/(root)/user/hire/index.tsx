import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, View } from "react-native";
import CreateHireListing from "@/features/hire/create/add-hire";
import MyHireCard from "@/features/hire/show/MyHire";
import { trpc } from "@/lib/trpc";
import { useAuthStore } from "@/store/authStore";

export default function MyHireListing() {
  const getAuthStoreToken = useAuthStore((state) => state.token);

  return <View>{getAuthStoreToken ? <MyHire /> : <CreateHireListing />}</View>;
}

function MyHire() {
  const { data, error, isLoading, isError } = useQuery(
    trpc.hirerouter.show.queryOptions(),
  );
  if (isLoading) return <ActivityIndicator />;
  if (!data) return <CreateHireListing />;
  return <MyHireCard data={data} />;
}
