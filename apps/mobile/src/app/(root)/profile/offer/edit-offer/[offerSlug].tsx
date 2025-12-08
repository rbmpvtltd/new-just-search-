import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import EditOffer from "@/features/offer/forms/update/EditOffer";
import { trpc } from "@/lib/trpc";

export default function CreateOffer() {
  const params = useLocalSearchParams();
  const slug = Array.isArray(params) ? params[0] : params;
  const { data, isError, error } = useQuery(
    trpc.offerrouter.edit.queryOptions({ offerSlug: slug ?? "" }),
  );
  if (isError) {
    return <Text className="text-secondary">{error.message}</Text>;
  }
  if (!data) {
    return <Text className="text-secondary">No offer found</Text>;
  }
  return (
    <View>
      <BoundaryWrapper>
        <EditOffer myOffer={data} />
      </BoundaryWrapper>
    </View>
  );
}
