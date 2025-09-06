import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { apiUrl } from "@/constants/Variable";

type BusinessListingCardProps = {
  item: {
    id: string;
    photo: string;
    name: string;
    description: string;
    categories: { title: string }[];
    subcategories: { name: string }[];
    specialities: string;
    building_name: string;
    area: string;
    street_name: string;
    real_address: string;
    landmark: string;
    pincode: string;
    city?: {
      city?: string;
    };
    state: {
      name: string;
    };
    email: string;
    phone_number: string;
    whatsapp_no: string;
    home_delivery: boolean;
    latitude: number;
    longitude: number;
    image1: string;
    user: {
      verify: number;
    };
  };
};
export default function BusinessListingCard({
  item,
}: BusinessListingCardProps) {
  const router = useRouter();

  return (
    <View className="w-full h-full bg-base-100">
      <View className="bg-base-200 rounded-xl shadow-md mx-4 my-6 p-4">
        <Text className="text-secondary text-xl font-semibold mb-2">
          My Listings
        </Text>
        <View className="border-b border-secondary mb-4" />

        <Image
          source={{
            uri: `${apiUrl}/assets/images/${item?.photo}`,
          }}
          className="w-full h-44 rounded-lg mb-3"
          resizeMode="contain"
        />
        <View className="flex-row items-center justify-between w-[100%]">
          <Text className="text-secondary text-lg font-semibold  mb-1 w-[80%]">
            {item?.name}
          </Text>
          {Number(item?.user?.verify) === 1 && (
            <Ionicons name="checkmark-circle" size={24} color="green" />
          )}
        </View>
        <Text className="text-secondary text-sm mb-4">
          {item.street_name}, {item.area}
          {item.pincode}
        </Text>

        <View className="flex-row justify-between">
          <View className="bg-success rounded-lg py-3 px-4 w-[48%] flex-row items-center justify-center">
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() =>
                router.push({
                  pathname: "/businessEditForms/[editBusiness]",

                  params: { editBusiness: item.id },
                })
              }
            >
              <Ionicons name="create-outline" size={20} color="#fff" />
              <Text className="text-secondary ml-2 font-medium">Edit</Text>
            </Pressable>
          </View>
          <View className="bg-info rounded-lg py-3 px-4 w-[48%] flex-row items-center justify-center">
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                router.push({
                  pathname: "/aboutBusiness/[premiumshops]",
                  params: { premiumshops: item.id },
                });
              }}
            >
              <Ionicons name="eye-outline" size={20} color="#fff" />
              <Text className="text-secondary ml-2 font-medium">View</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
