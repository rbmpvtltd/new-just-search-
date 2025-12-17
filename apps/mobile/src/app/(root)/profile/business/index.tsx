import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, Text, View } from "react-native";
import { useAuthStore } from "@/features/auth/authStore";
import CreateBusinessListing from "@/features/business/create/add-business";
import MyBusinessCard from "@/features/business/show/MyBusiness";
import { trpc } from "@/lib/trpc";

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

  if (isError) {
    if (error.shape?.data.httpStatus === 401) {
      return <CreateBusinessListing />;
    }
  }

  if (isLoading) return <ActivityIndicator />;
  if (!data) return <CreateBusinessListing />;
  return <MyBusinessCard data={data} />;
}
