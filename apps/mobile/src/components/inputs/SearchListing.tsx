import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import NativeWind from "nativewind";
import React from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { useStartChat } from "@/query/startChat";
import { useAuthStore } from "@/store/authStore";
import { dialPhone } from "@/utils/getContact";
import { openInGoogleMaps } from "@/utils/getDirection";

export type SubcategoriesType = {
  id: number;
  name: string;
  slug: string;
  parent_id: number;
  status: number;
  created_at: string;
  updated_at: string;
  pivot: {
    listing_id: number;
    subcategory_id: number;
  };
};

function SearchListCard<T>({ item }: { item: any }) {
  const { mutate: startChat, isPending } = useStartChat();
  const clearToken = useAuthStore((state) => state.clearToken);

  const latitude = Number(item?.latitude.split(",").shift());
  const longitude = Number(item?.longitude.split(",").pop());

  return (
    <View className="mb-10 rounded-lg w-[90%] p-4 shadow-lg mx-auto  bg-base-200">
      <View className="mx-auto mt-2 w-[60%] flex items-center justify-center">
        <Pressable
          onPress={() => {
            if (item.type == "1") {
              router.push(`/aboutBusiness/${item?.id}`);
            } else if (item.type == "2") {
              router.push({
                pathname: "/hireDetail/[hiredetails]",
                params: {
                  hiredetails: item?.slug,
                },
              });
            }
          }}
        >
          <Image
            className="w-full mx-auto h-[300px] rounded-lg aspect-[3/4] "
            resizeMode="cover"
            source={{
              uri: `https://www.justsearch.net.in/assets/images/${item.photo}`,
            }}
          />
        </Pressable>
      </View>
      <View className="h-auto w-full mt-4 mx-2">
        <Text className="text-secondary text-2xl font-semibold">
          {item.name}
        </Text>
      </View>

      {/* Buttons Section */}
      <View className="flex-row gap-2 mt-4 mx-2 flex-wrap">
        <TouchableOpacity className="bg-success-content rounded-lg py-2 px-4">
          <Text className="text-success font-semibold text-xs">
            {item?.categories[0]?.title}
          </Text>
        </TouchableOpacity>
        {item?.subcategories?.map(
          (subcategory: SubcategoriesType, i: number) => (
            <TouchableOpacity
              key={i.toString()}
              className="bg-error-content rounded-lg py-2 px-4"
            >
              <Text className="text-pink-700 font-semibold text-xs">
                {subcategory?.name}
              </Text>
            </TouchableOpacity>
          ),
        )}
      </View>

      {/* Location Section */}
      <Text className="text-secondary-content my-4 mx-3">
        <Ionicons name="location" /> {item.building_name}, {item.street_name}
        {item?.real_address}
      </Text>

      <View className="w-full items-center gap-4 my-4">
        {Number(item?.type) === 1 && (
          <View className="w-[90%] bg-primary rounded-lg py-2 px-4 ">
            <Pressable onPress={() => openInGoogleMaps(latitude, longitude)}>
              <View className="flex-row items-center justify-center">
                <Ionicons size={18} name="location" color="#fff" />
                <Text className="text-[#fff] font-semibold text-xl text-center ml-2">
                  Get Direction
                </Text>
              </View>
            </Pressable>
          </View>
        )}
        <View className="w-[90%] bg-primary rounded-lg py-2 px-4 ">
          <Pressable onPress={() => dialPhone(item.phone_number)}>
            <View className="flex-row items-center justify-center">
              <Ionicons size={18} name="call" color="#fff" />
              <Text className="text-[#fff] font-semibold text-xl text-center ml-2">
                Contact Now
              </Text>
            </View>
          </Pressable>
        </View>
        <View className="w-[90%] bg-primary rounded-lg py-2 px-4">
          <Pressable
            onPress={() => {
              startChat(item.categories[0].pivot.listing_id, {
                onSuccess: (res) => {
                  console.log("Chat started:", res?.chat_session_id);
                  console.log(res);

                  if (!res?.chat_session_id) {
                    Alert.alert(
                      "Login Required ",
                      "Need to login for start chatting on your behalf",
                      [
                        {
                          text: "No Thanks",
                          style: "cancel",
                        },
                        {
                          text: "Login Now",
                          style: "destructive",
                          onPress: () => {
                            clearToken();
                            router.replace("/user/bottomNav/profile");
                          },
                        },
                      ],
                      { cancelable: false },
                    );
                  } else {
                    router.push({
                      pathname: "/chat/[chat]",
                      params: { chat: res?.chat_session_id.toString() },
                    });
                  }
                },
                onError: (err) => {
                  Alert.alert("Something Went Wrong");
                  console.error("Failed to start chat:", err);
                },
              });
            }}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons size={18} name="chatbox-ellipses" color="#fff" />
              <Text className="text-[#fff] font-semibold text-xl text-center ml-2">
                Chat Now
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default SearchListCard;
