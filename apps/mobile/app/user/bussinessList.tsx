import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import BusinessListingCard from "@/components/cards/BusinessListingCard";
import { MY_BUSINESS_LIST_URL } from "@/constants/apis";
import { useSuspenceData } from "@/query/getAllSuspense";

export default function BusinessList() {
  const { data: businessList } = useSuspenceData(
    MY_BUSINESS_LIST_URL.url,
    MY_BUSINESS_LIST_URL.key,
    "",
    true,
  );

  const noData =
    !businessList?.data ||
    businessList?.status === 404 ||
    businessList?.data?.message === "Listing not found";

  return (
    <View className="p-4">
      {noData ? (
        <View>
          <Pressable
            className="bg-primary py-3 rounded-xl w-full flex-row items-center justify-center shadow-sm"
            onPress={() => router.push("/businessListingForm")}
            // disabled={noData}
          >
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
            <Text className="text-secondary ml-2 font-semibold">
              Add New Business Listing
            </Text>
          </Pressable>
        </View>
      ) : (
        <BusinessListingCard item={businessList.data} />
      )}
    </View>
  );
}
