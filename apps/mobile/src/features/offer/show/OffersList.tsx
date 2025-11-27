import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import { FlatList, Image, Text, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { OFFERS_URL } from "@/constants/apis";
import { apiUrl } from "@/constants/Variable";
import { useSuspenceData } from "@/query/getAllSuspense";
import { useStartOfferChat } from "@/query/startOfferChat";
import { useAuthStore } from "@/store/authStore";
import { showLoginAlert } from "@/utils/alert";
import { openInGoogleMaps } from "@/utils/getDirection";
import DataNotFound from "../../../components/ui/DataNotFound";

export default function OffersList() {
  const { data } = useSuspenceData(OFFERS_URL.url, OFFERS_URL.key);
  const isAuthenticated = useAuthStore((state) => state.authenticated);
  const clearToken = useAuthStore((state) => state.clearToken);
  const { mutate: startOfferChat, isPending } = useStartOfferChat();

  if (!data.offers) {
    return <DataNotFound />;
  }

  return (
    <FlatList
      className=""
      keyExtractor={(_, i) => i.toString()}
      data={data.offers}
      renderItem={(item: any) => {
        const latitude = String(item?.item?.latitude).replaceAll(",","");
        const longitude = String(item?.item?.longitude).replaceAll(",","");
        return (
          <View className="bg-base-200 rounded-lg w-[90%] shadow-lg mx-auto my-2">
            {/* Image Section */}
            <View className="relative">
              <View className="relative h-auto mx-auto mt-2 w-[60%] ">
                <Pressable
                  onPress={() => {
                    router.push({
                      pathname: "/(root)/(home)/subcategory/aboutBusiness/offers/singleOffers/[singleOffer]",
                      params: { singleOffer: item?.item?.id },
                    });
                  }}
                >
                  <Image
                    className="w-full rounded-lg aspect-[3/4]"
                    source={{
                      uri: `${apiUrl}/assets/images/${item?.item?.image1}`,
                    }}
                  />
                  <Text className="absolute bg-error text-secondary mt-8 pl-8 pr-3 rounded-r-md t-10">
                    -{item?.item?.discount_percent}%
                  </Text>
                </Pressable>
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
            <View className="h-auto w-full mt-4 px-4">
              <Text className="text-primary text-lg ">
                ₹{item?.item?.final_price}
                <Text className="text-secondary line-through">
                  ₹{item?.item?.rate}
                </Text>
              </Text>
            </View>

            <View className="w-full items-center gap-4 my-4">
              <View className="w-[90%] bg-primary rounded-lg py-2 px-4">
                <Pressable
                  onPress={() => openInGoogleMaps(latitude, longitude)}
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
                    if (!isAuthenticated) {
                      showLoginAlert({
                        message: "Need to login to chat on your behalf",
                        onConfirm: () => {
                          clearToken();
                          router.replace("/(root)/profile");
                        },
                      });
                    } else {
                      startOfferChat(
                        {
                          listingId: item?.item?.listing_id,
                          offerId: item?.item?.id,
                        },
                        {
                          onSuccess: (res) => {
                            router.push({
                              pathname: "/chat/[chat]",
                              params: { chat: res?.chat_session_id.toString() },
                            });
                          },
                          onError: (err) => {
                            console.error("Failed to start chat:", err);
                          },
                        },
                      );
                    }
                  }}
                >
                  <View className=" text-xl text-center flex-row py-1 gap-2 justify-center">
                    <Ionicons
                      size={20}
                      name="chatbox-ellipses"
                      color={"white"}
                    />
                    <Text className="text-[#ffffff] font-semibold">
                      Chat Now
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        );
      }}
    />
  );
}
