import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, View } from "react-native";
import CreateBusinessListing from "@/features/business/create/add-business";
import MyBusinessCard from "@/features/business/show/MyBusiness";
import { trpc } from "@/lib/trpc";
import { useAuthStore } from "@/store/authStore";

export default function MyBusinessListing() {
  const getAuthStoreToken = useAuthStore((state) => state.token);

  return (
    <View>
      {getAuthStoreToken ? <MyBusiness /> : <CreateBusinessListing />}
    </View>
  );
}

function MyBusiness() {
  const { data, error, isLoading, isError } = useQuery(
    trpc.businessrouter.show.queryOptions(),
  );
  if (isLoading) return <ActivityIndicator />;
  if (!data) return <CreateBusinessListing />;
  return <MyBusinessCard data={data} />;
}
