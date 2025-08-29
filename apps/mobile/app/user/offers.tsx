import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import OfferCard from "@/components/offerPageCompo/OfferCard";
import { SomethingWrong } from "@/components/ui/SomethingWrong";
import { useOfferList } from "@/query/myOfferList";
export default function product() {
  const { data, isLoading, isError, fetchNextPage, hasNextPage } =
    useOfferList();
  const router = useRouter();
  if (isLoading) return <ActivityIndicator />;

  if (isError) return <SomethingWrong />;

  if (!data?.pages[0]?.data || data?.pages[0].data.length === 0)
    return (
      <View className="px-4 mt-4">
        <Pressable
          className="bg-primary py-3 rounded-xl w-full flex-row items-center justify-center shadow-sm"
          onPress={() => router.push("/user/addOffer")}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text className="text-secondary ml-2 font-semibold">
            Add New Offer
          </Text>
        </Pressable>
      </View>
    );
  const offersData = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <View className="flex-1 bg-base-100">
      <FlatList
        data={offersData}
        renderItem={({ item }) => <OfferCard item={item} />}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}
