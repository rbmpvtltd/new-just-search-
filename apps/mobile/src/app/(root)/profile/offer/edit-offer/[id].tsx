import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import { SomethingWrong } from "@/components/ui/SomethingWrong";
import EditOffer from "@/features/offer/forms/update/EditOffer";
import { trpc } from "@/lib/trpc";

export default function CreateOffer() {
  const { id } = useLocalSearchParams();

  const { data, isError, isLoading } = useQuery(
    trpc.offerrouter.edit.queryOptions({ id: Number(id) ?? "" }),
  );
  if (isLoading)
    return (
      <View className="flex-1 items-center justify-center py-10">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  if (isError) {
    return <SomethingWrong  />;
  }
  if (!data) {
    return <Text className="text-secondary">No offer found</Text>;
  }
  return (
    <BoundaryWrapper>
      <EditOffer myOffer={data} />
    </BoundaryWrapper>
  );
}
