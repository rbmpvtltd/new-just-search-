import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import { SomethingWrong } from "@/components/ui/SomethingWrong";
import UpdateHireListing from "@/features/hire/update/edit-hire";
import { trpc } from "@/lib/trpc";

export default function EditMyHireListing() {
  const { id } = useLocalSearchParams();

  const { data, isLoading, isError, error } = useQuery(
    trpc.hirerouter.edit.queryOptions({ id: Number(id) ?? "" }),
  );
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-10">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }
  if (isError) {
    return <SomethingWrong />;
  }
  if (!data) {
    return <Text className="text-secondary">No listing found</Text>;
  }

  return (
    <BoundaryWrapper>
      <UpdateHireListing data={data} />
    </BoundaryWrapper>
  );
}
