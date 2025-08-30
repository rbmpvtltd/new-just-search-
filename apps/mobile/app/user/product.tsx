import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import ProductListingCard from "@/components/cards/ProductCard";
import { useProductList } from "@/query/myProductList";
export default function product() {
  const { data, isLoading, fetchNextPage, hasNextPage } = useProductList();
  
  const router = useRouter();
  if (isLoading) return <ActivityIndicator />;
  

  if (!data?.pages[0]?.data || data?.pages[0].data.length === 0)
    return (
      <View className="px-4 mt-4">
        <Pressable
          className="bg-primary py-3 rounded-xl w-full flex-row items-center justify-center shadow-sm"
          onPress={() => router.push("/user/addProduct")}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text className="text-secondary ml-2 font-semibold">
            Add New Product
          </Text>
        </Pressable>
      </View>
    );
  const products = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <View className="flex-1 bg-base-100">
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductListingCard item={item} />}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}
