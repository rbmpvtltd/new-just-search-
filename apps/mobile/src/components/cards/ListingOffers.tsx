import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import {Pressable, FlatList, Image, Text, TouchableOpacity, View } from "react-native";

import { LISTING_OFFER_LIST_URL } from "@/constants/apis";
import { useSuspenceData } from "@/query/getAllSuspense";
import { useListingOffersList } from "@/query/listingOfferList";

export default function ListingsOffersList({
  listingId,
}: {
  listingId: string;
}) {
  const { data } = useSuspenceData(
    LISTING_OFFER_LIST_URL.url,
    LISTING_OFFER_LIST_URL.key,
    listingId,
  );

  return (
    <FlatList
      keyExtractor={(_, i) => i.toString()}
      data={data.offer}
      renderItem={(item: any) => {
        return (
            <Pressable
              onPress={() => {
                router.push({
                  pathname: "/(root)/(home)/subcategory/aboutBusiness/offers/singleOffers/[singleOffer]",
                  params: { singleOffer: item?.item?.id },
                });
              }}
            >
              <View className="bg-base-200 rounded-lg w-[90%] shadow-lg m-4">
                {/* Image Section */}
                <View className="relative">
                  <View className="relative h-[300px] mx-auto mt-2 w-[60%] ">
                    <Image
                      className="w-full rounded-lg aspect-[3/4]"
                      source={{
                        uri: `https://www.justsearch.net.in/assets/images/${item?.item?.image1}`,
                      }}
                    />
                    <Text className="absolute bg-error text-secondary mt-8 pl-8 pr-3 rounded-r-md t-10">
                      -{item?.item?.discount_percent}%
                    </Text>
                  </View>
                </View>
                <View className="h-auto w-full mt-4 px-4">
                  <Text className="text-secondary text-2xl font-semibold">
                    {item?.item?.product_name ?? "Unknown"}
                  </Text>
                </View>
                <View className="h-auto w-full mt-4 px-4">
                  <Text className="text-secondary text-lg ">
                    {item?.item?.listing_name}
                  </Text>
                </View>
                <View className="h-auto w-full mt-4 px-4 mb-6 text-center">
                  <Text className="text-primary text-lg ">
                    ₹{item?.item?.final_price}
                    <Text className="text-secondary line-through">
                      ₹{item?.item?.rate}
                    </Text>
                  </Text>
                </View>
              </View>
            </Pressable>
        );
      }}
    />
  );
}
