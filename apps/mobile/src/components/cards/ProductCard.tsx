import { Alert, Image, Text, useColorScheme, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { RelativePathString, useRouter } from "expo-router";
import { apiUrl } from "@/constants/Variable";
import { useDeleteProduct } from "@/query/deleteProduct";
import { Pressable } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";

type ProductListingCardProps = {
  item: {
    id: number;
    image1: string;
    product_name: string;
    rate: string;
    category_id: string;
    subcategory_id: string;
    product_description: string;
    image2?: string;
    image3?: string;
    image4?: string;
    image5?: string;
  };
};

export default function ProductListingCard({ item }: ProductListingCardProps) {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { mutate: deleteProductMutation } = useDeleteProduct();

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
            deleteProductMutation({
              data: {},
              id: String(item.id),
            });
          },
        },
      ],
    );
  };

  // const handleCardPress = () => {
  //   router.push({
  //     pathname: '/singleProduct/[singleProduct]',
  //     params: { singleProduct: item.id.toString() },
  //   });
  // };

  return (
    <View className="w-full h-full bg-base-100 flex-1">
      <View className="bg-base-200 rounded-2xl shadow-md mx-4 my-6 p-4">
        {/* <Pressable onPress={handleCardPress}> */}
        <Image
          source={{
            uri: `${apiUrl}/assets/images/${item.image1}`,
          }}
          className="w-[100%] h-44 rounded-xl mb-4"
          resizeMode="contain"
        />

        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-secondary text-lg font-bold w-[50%]">
            {item.product_name}
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
              router.push(`editProduct/${item.id}` as RelativePathString)
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
