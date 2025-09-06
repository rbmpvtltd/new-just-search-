import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { Pressable } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import { apiUrl } from "@/constants/Variable";
import { useDeleteOffer } from "@/query/deleteOffer";
import { useAuthStore } from "@/store/authStore";

type OfferCardProps = {
  item: {
    id: number;
    product_name?: string;
    rate: string;
    discount_percent?: string;
    final_price: string;
    expiresAt?: string;
    heading?: string;
    category_id: string;
    subcategory_id: string;
    product_description: string;
    offer_start_date: string;
    offer_end_date: string;
    reupload_count: number;
    image1?: string;
    image2?: string;
    image3?: string;
    image4?: string;
    image5?: string;
  };
};

export default function OfferCard({ item }: OfferCardProps) {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const isoStringStartDate = item.offer_start_date;
  const isoStringEndDate = item.offer_end_date;
  const startDate = new Date(isoStringStartDate);
  const endDate = new Date(isoStringEndDate);
  const { mutate: deleteOfferMutation } = useDeleteOffer();
  const formattedStartDate = startDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedEndDate = endDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleDelete = () => {
    Alert.alert("Delete offer", "Are you sure you want to delete this offer?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteOfferMutation({
            data: {},
            id: String(item.id),
          });
        },
      },
    ]);
  };
  return (
    <View className="w-full h-full bg-base-100 flex-1">
      <View className="bg-base-200 rounded-2xl shadow-md mx-4 my-6 p-4">
        {/* <Text className="text-secondary text-xl font-semibold mb-2">
          My {item.heading}
        </Text>
        <View className="border-b border-secondary mb-4" /> */}
        <Image
          source={{ uri: `${apiUrl}/assets/images/${item.image1}` }}
          className="h-56 aspect-[3/4] mx-auto rounded-xl mb-4"
          resizeMode="cover"
        />

        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-secondary text-lg font-bold w-[50%]">
            {item?.product_name}
          </Text>
          <View className="w-[50%] items-end">
            <Text className="text-xs text-secondary">
              Offer Start Date: {formattedStartDate}
            </Text>

            <Text className="text-xs text-secondary">
              Offer End Date: {formattedEndDate}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between">
          <Pressable
            style={{
              backgroundColor: Colors[colorScheme ?? "light"].success,
              borderRadius: 8, // rounded-xl = 16px
              paddingVertical: 12, // py-3 = 12px
              paddingHorizontal: 16, // px-4 = 16px
              width: "48%", // w-[48%]
              flexDirection: "row", // flex-row
              alignItems: "center", // items-center
              justifyContent: "center", // justify-center
              shadowColor: "#000", // shadow-sm basic setup
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 1.5,
              elevation: 2, // for Android shadow
            }}
            className="bg-success rounded-xl py-3 px-4 w-[48%] flex-row items-center justify-center shadow-sm"
            onPress={() => router.navigate(`/editOffer/${item.id}`)}
          >
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text className="text-success-content ml-2 font-medium">Edit</Text>
          </Pressable>
          <Pressable
            style={{
              backgroundColor: Colors[colorScheme ?? "light"].error,
              borderRadius: 8, // rounded-xl = 16px
              paddingVertical: 12, // py-3 = 12px
              paddingHorizontal: 16, // px-4 = 16px
              width: "48%", // w-[48%]
              flexDirection: "row", // flex-row
              alignItems: "center", // items-center
              justifyContent: "center", // justify-center
              shadowColor: "#000", // shadow-sm basic setup
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 1.5,
              elevation: 2, // for Android shadow
            }}
            className="bg-error rounded-xl py-3 px-4 w-[48%] flex-row items-center justify-center shadow-sm"
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
