import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import { SomethingWrong } from "@/components/ui/SomethingWrong";
import EditProduct from "@/features/product/forms/update/EditProduct";
import { trpc } from "@/lib/trpc";

export default function CreateProduct() {
  const { id } = useLocalSearchParams();
  const { data, isError, error, isLoading } = useQuery(
    trpc.productrouter.edit.queryOptions({ id: Number(id) ?? "" }),
  );
  if (isLoading)
    return (
      <View className="flex-1 items-center justify-center py-10">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  if (isError) {
    console.log(error);
    return <SomethingWrong />;
  }
  if (!data) {
    return <Text className="text-secondary">No product found</Text>;
  }
  return (
    <BoundaryWrapper>
      <EditProduct myProduct={data} />
    </BoundaryWrapper>
  );
}
