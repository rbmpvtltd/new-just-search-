import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import UpdateHireListing from "@/features/hire/update/edit-hire";
import { trpc } from "@/lib/trpc";

export default function EditMyHireListing() {
  const { params } = useLocalSearchParams();
  console.log("paramns", params);

  const id = Array.isArray(params) ? params[0] : params;
  console.log("id", id);

  const { data, isLoading, isError, error } = useQuery(
    trpc.hirerouter.edit.queryOptions({ id: Number(id) ?? "" }),
  );
  if (isLoading) {
    return <Text className="text-secondary">Loading...</Text>;
  }
  if (isError) {
    return <Text className="text-secondary">{error.message}</Text>;
  }
  if (!data) {
    return <Text className="text-secondary">No listing found</Text>;
  }

  return (
    <BoundaryWrapper>
      {/* <UpdateHireListing /> */}
      <View> {id} </View>
    </BoundaryWrapper>
  );
}
