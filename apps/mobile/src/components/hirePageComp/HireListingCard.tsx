import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, useColorScheme, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import { apiUrl } from "@/constants/Variable";

type HireListingCardProps = {
  item: {
    id: string;
    photo?: string;
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
    city: {
      city: string;
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
  };
  isVerify: number;
};
export default function HireListingCard({
  item,
  isVerify,
}: HireListingCardProps) {
  const colorScheme = useColorScheme();
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
        <View className="w-[100%] flex-row items-center justify-between">
          <Text className="text-secondary text-lg font-semibold mb-1 w-[80%]">
            {item?.name}
          </Text>
          {Number(isVerify) === 1 && (
            <Ionicons name="checkmark-circle" size={24} color="green" />
          )}
        </View>
        <Text className="text-secondary text-sm mb-4">
          {item?.real_address}, {item?.area} {item?.pincode}, {item?.city?.city}
          , {item?.state?.name}
        </Text>

        <View className="flex-row justify-between">
          <Pressable
            style={{
              backgroundColor: Colors[colorScheme ?? "light"].success, // or use your theme's success color
              borderRadius: 8,
              paddingVertical: 12,
              paddingHorizontal: 16,
              width: "48%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              router.push({
                pathname: "/editHire/[editHire]",
                params: { editHire: item.id },
              });
            }}
          >
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text style={{ color: "#fff", marginLeft: 8, fontWeight: "500" }}>
              Edit
            </Text>
          </Pressable>

          <Pressable
            style={{
              backgroundColor: Colors[colorScheme ?? "light"].info, // or use your theme's info color
              borderRadius: 8,
              paddingVertical: 12,
              paddingHorizontal: 16,
              width: "48%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="eye-outline" size={20} color="#fff" />
            <Text style={{ color: "#fff", marginLeft: 8, fontWeight: "500" }}>
              View
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
