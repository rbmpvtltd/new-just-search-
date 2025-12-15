import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import { Image, Text, View, Pressable, Alert } from "react-native";
import { OfferProductHitType } from "@/app/(root)/(offer)/allOffers";
import { useStartChat } from "@/query/startChat";

export default function OffersList({ item }: { item: OfferProductHitType }) {
  const { mutate: startChat } = useStartChat();

  return (
    <View className="bg-base-200 rounded-lg w-[90%] shadow-lg mx-auto my-2">
      {/* Image Section */}
      <View className="relative">
        <View className="relative h-auto mx-auto mt-2 w-[60%] ">
          <Pressable
            onPress={() => {
              router.push({
                pathname:
                  "/(root)/(home)/subcategory/aboutBusiness/offers/singleOffers/[singleOffer]",
                params: { singleOffer: item.navigationId },
              });
            }}
          >
            <Image
              className="w-full rounded-lg aspect-[3/4]"
              source={{
                uri: `https://justsearch.net.in/assets/images/banners/VQLWj9VB1760704912.png`, // TODO: change image when upload to cloudinary
              }}
            />
            {item.discountPercent > 0 && (
              <Text className="absolute bg-error text-secondary mt-8 pl-8 pr-3 rounded-r-md t-10">
                -{item.discountPercent}%
              </Text>
            )}
          </Pressable>
        </View>
      </View>
      <View className="h-auto w-full mt-4 px-4">
        <Text className="text-secondary text-2xl font-semibold">
          {item?.name ?? "Unknown"}
        </Text>
      </View>
      {/* <View className="h-auto w-full mt-4 px-4">
        <Text className="text-secondary text-lg ">
          {item?.item?.listing_name}
        </Text>
      </View> TODO: add listing name in algolia seed */}
      <View className="h-auto w-full mt-4 px-4">
        {item.discountPercent > 0 && (
          <Text className="text-primary text-lg ">
            ₹{item.finalPrice}
            <Text className="text-secondary line-through">₹{item.price}</Text>
          </Text>
        )}
        {item.discountPercent === 0 && (
          <Text className="text-primary text-lg ">₹{item.price}</Text>
        )}
      </View>

      <View className="w-full items-center gap-4 my-4">
        <View className="w-[90%] bg-primary rounded-lg py-2 px-4">
          <Pressable
            onPress={() => {
              if (item.discountPercent > 0) {
                router.push(
                  `/(root)/(home)/subcategory/aboutBusiness/offers/singleOffers/${item.navigationId}`,
                );
              } else {
                router.push(
                  `/(root)/(home)/subcategory/aboutBusiness/products/singleProduct/${item.navigationId}`,
                );
              }
            }}
          >
            <View className=" text-xl text-center flex-row py-1 gap-2 justify-center">
              <Ionicons size={20} name="location" color={"white"} />
              <Text className="text-[#ffffff] font-semibold">
                Get Direction
              </Text>
            </View>
          </Pressable>
        </View>

        <View className="w-[90%] bg-primary rounded-lg py-2 px-4">
          <Pressable
            onPress={() => {
              startChat(String(item.businessId), {
                onSuccess: (res) => {
                  if (res?.chat_session_id) {
                    router.push({
                      pathname: "/chat/[chat]",
                      params: { chat: res?.chat_session_id.toString() },
                    });
                  } else {
                    Alert.alert(
                      "Authentication Required",
                      "You must be logged in to use chat.",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Sign In",
                          onPress: () => {
                            router.navigate("/(root)/profile");
                          },
                        },
                      ],
                    );
                    [];
                  }
                },
              });
            }}
          >
            <View className=" text-xl text-center flex-row py-1 gap-2 justify-center">
              <Ionicons size={20} name="chatbox-ellipses" color={"white"} />
              <Text className="text-[#ffffff] font-semibold">Chat Now</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
