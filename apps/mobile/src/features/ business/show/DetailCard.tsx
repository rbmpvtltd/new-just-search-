import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { memo, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Pressable } from "react-native-gesture-handler";
import StarRating from "react-native-star-rating-widget";
import Colors from "@/constants/Colors";
import { useToggleWishlist, useWishlist } from "@/query/favorite";
import { useStartChat } from "@/query/startChat";
import { useAuthStore } from "@/store/authStore";
import { useShopIdStore } from "@/store/shopIdStore";
import { showLoginAlert } from "@/utils/alert";
import { dialPhone } from "@/utils/getContact";
import { openInGoogleMaps } from "@/utils/getDirection";
import { OutputTrpcType } from "@/lib/trpc";
import Favourite from "../shared/FaouritBtn";


type DetailCardType = OutputTrpcType["subcategoryRouter"]["businessesByCategoryInfinate"]["data"][number];



const screenWidth = Dimensions.get("window").width;

function DetailCard({
  item,
  type,
  category,
  subcategories,
}: {
  item: DetailCardType;
  type: number;
  category: string;
  subcategories: any;
}) {
  const [aspectRatio, setAspectRatio] = useState(3 / 4);
  const colorScheme = useColorScheme();
  const { setShopId } = useShopIdStore();
  const isAuthenticated = useAuthStore((state) => state.authenticated);
  const { mutate: toggleWishlist } = useToggleWishlist();
  const clearToken = useAuthStore((state) => state.clearToken);
  const { data: wishlist = [] } = useWishlist();
  const { mutate: startChat } = useStartChat();

  const latitude = Number(item?.latitude?.split(",").shift());
  const longitude = Number(item?.longitude?.split(",").pop());


  const wishlistArray = Array.isArray(wishlist?.data) ? wishlist.data : [];

  const isFavourite = useMemo(
    () => wishlistArray.some((fav: any) => fav.listing_id === item.id),
    [wishlistArray, item.id],
  );
  let rating: number;

  const rawRate = Number(item.rating);

  if (!isNaN(rawRate)) {
    rating = Number(rawRate.toFixed(0));
  } else {
    rating = 0;
  }

  return (
    <View className="bg-base-200 h-auto rounded-lg w-[90%] shadow-lg  m-4">
      {/* Image Section */}
      <Pressable
        onPress={() => {
          setShopId(String(item.id));
          router.navigate({
            pathname: "/aboutBusiness/[premiumshops]",
            params: { premiumshops: item.id.toString() },
          });
        }}
      >
        <View
          className="w-full mx-auto justify-center items-center rounded-2xl overflow-hidden mb-4 m-4"
          style={{
            height: screenWidth * 0.6 * (1 / aspectRatio),
            aspectRatio,
          }}
        >
          <Image
            className="h-full w-full"
            source={{
              uri:"https://www.justsearch.net.in/assets/images/banners/ZmQkEttf1759906394.png", // TODO : change image when upload on cloudinary
            }}
            resizeMode="contain"
          />
        </View>
      </Pressable>
      <View className="mx-auto">
        <StarRating
          rating={rating}
          onChange={() => {}}
          starSize={24}
          enableSwiping={false}
        />
      </View>
      <View className="h-auto w-full flex-row justify-between mt-2 px-4 mx-2 ">
        <Text className="text-secondary text-2xl font-semibold w-[65%] ">
          {item.name}
        </Text>
        {/* {Number(item?.user?.verify) === 1 && (
          <Ionicons name="checkmark-circle" size={28} color="green" />
        )} */}
        {Number(type) === 1 && (
          <View className="w-[10%]">
           <Favourite initialFav={item.isFavourite} businessId={item.id}/>
          </View>
        )}
      </View>

      {/* Buttons Section */}
      <View className="flex-row gap-2 mt-4 mx-6 flex-wrap">
        <TouchableOpacity className="bg-success-content rounded-lg py-2 px-4">
          <Text className="text-success font-semibold text-xs">{category}</Text>
        </TouchableOpacity>
        {subcategories?.map((item: any, i: number) => (
          <TouchableOpacity
            className="bg-error-content rounded-lg py-2 px-4"
            key={i.toString()}
          >
            <Text className="text-pink-700 font-semibold text-xs">{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Location Section */}
      <Text className="text-secondary-content my-4 mx-3">
        <Ionicons name="location" /> {item.buildingName} {item.streetName}
        {item.area}
      </Text>

      <View className="w-full items-center gap-4 my-4">
        {Number(type) === 1 && (
          <View className="w-[90%] bg-primary rounded-lg py-2 px-4">
            <Pressable
              onPress={() =>
                openInGoogleMaps(String(latitude), String(longitude))
              }
            >
              <View className=" text-xl text-center flex-row py-1 gap-2 justify-center">
                <Ionicons size={20} name="location" color={"white"} />
                <Text className="text-[#ffffff] font-semibold">
                  Get Direction
                </Text>
              </View>
            </Pressable>
          </View>
        )}
        <View className="w-[90%] bg-primary rounded-lg py-2 px-4">
          <Pressable onPress={() => dialPhone(item?.phoneNumber || "")}>
            <View className=" text-xl text-center flex-row py-1 gap-2 justify-center">
              <Ionicons size={20} name="call" color={"white"} />
              <Text className="text-[#ffffff] font-semibold">Contact Now</Text>
            </View>
          </Pressable>
        </View>
        <View className="w-[90%] bg-primary rounded-lg py-2 px-4">
          <Pressable
            onPress={() => {
              startChat(String(item?.id), {
                onSuccess: (res) => {
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
                            router.replace("/(root)/profile/profile");
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

export const MemoizedDetailCard = memo(DetailCard);
