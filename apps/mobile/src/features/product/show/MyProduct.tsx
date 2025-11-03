import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SomethingWrong } from "@/components/ui/SomethingWrong";
import Colors from "@/constants/Colors";
import { type OutputTrpcType, trpc } from "@/lib/trpc";
import { useDeleteProduct } from "@/query/deleteProduct";
export default function MyProductsList() {
  const {
    data: myProducts,
    isLoading,
    isError,
  } = useQuery(trpc.productrouter.showProduct.queryOptions());
  const router = useRouter();
  if (isLoading) return <ActivityIndicator />;

  if (isError) return <SomethingWrong />;
  // -->
  if (!myProducts?.products || myProducts.products.length === 0)
    return (
      <View className="px-4 mt-4">
        <Pressable
          className="bg-primary py-3 rounded-xl w-full flex-row items-center justify-center shadow-sm"
          onPress={() => router.push("/(root)/user/product/add-offer")}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text className="text-secondary ml-2 font-semibold">
            Add New Product
          </Text>
        </Pressable>
      </View>
    );
  const productsData = myProducts?.products ?? [];

  return (
    <View className="flex-1 bg-base-100">
      <FlatList
        data={productsData}
        renderItem={({ item }) => <ProductCard item={item} />}
        // onEndReached={() => {
        //   if (hasNextPage) fetchNextPage();
        // }}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

type ProductType = NonNullable<
  OutputTrpcType["productrouter"]["showProduct"]
>["products"][number];
function ProductCard({ item }: { item: ProductType }) {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { mutate: deleteProduct, isPending } = useMutation(
    trpc.businessrouter.deleteProduct.mutationOptions(),
  );

  const handleDelete = () => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteProduct(
              {
                id: item.id,
              },
              {
                onSuccess: (data) => {
                  if (data.success) {
                    Alert.alert("Product deleted successfully");
                  }
                },
              },
            );
          },
        },
      ],
    );
  };

  return (
    <View className="w-full h-full bg-base-100 flex-1">
      <View className="bg-base-200 rounded-2xl shadow-md mx-4 my-6 p-4">
        {/* <Pressable onPress={handleCardPress}> */}
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
          }}
          className="w-[100%] h-44 rounded-xl mb-4"
          resizeMode="contain"
        />

        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-secondary text-lg font-bold w-[50%]">
            {item.productName}
          </Text>
        </View>

        <Text className="text-success text-lg font-semibold mb-4">
          ₹{item.rate}
        </Text>
        {/* </Pressable> */}

        <View className="flex-row justify-between">
          <Pressable
            style={{
              backgroundColor: Colors[colorScheme ?? "light"].success,
              borderRadius: 12,
              paddingVertical: 12,
              paddingHorizontal: 16,
              width: "48%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() =>
              router.push(
                `/(root)/user/product/edit-product/${item.productSlug}`,
              )
            }
          >
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text className="text-secondary ml-2 font-medium">Edit</Text>
          </Pressable>
          <Pressable
            style={{
              backgroundColor: Colors[colorScheme ?? "light"].error,
              borderRadius: 12,
              paddingVertical: 12,
              paddingHorizontal: 16,
              width: "48%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={20} color="#fff" />
            <Text className="text-secondary ml-2 font-medium">Delete</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
