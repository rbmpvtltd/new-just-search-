import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import EditProduct from "@/features/product/forms/update/EditProduct";
import { trpc } from "@/lib/trpc";

export default function CreateProduct() {
  const params = useLocalSearchParams();
  const slug = Array.isArray(params) ? params[0] : params;
  const { data, isError, error } = useQuery(
    trpc.productrouter.edit.queryOptions({ productSlug: slug ?? "" }),
  );
  if (isError) {
    return <Text className="text-secondary">{error.message}</Text>;
  }
  if (!data) {
    return <Text className="text-secondary">No product found</Text>;
  }
  return (
    <View>
      <EditProduct myProduct={data} />
    </View>
  );
}
