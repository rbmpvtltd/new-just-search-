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

const screenWidth = Dimensions.get("window").width;

function DetailCard({
  item,
  type,
  category,
  subcategories,
}: {
  item: any;
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

  const latitude = Number(item?.latitude.split(",").shift());
  const longitude = Number(item?.longitude.split(",").pop());

  // console.log("item", item.photo, item.image1, item.image2, item.image3, item.image4, item.image5);

  const imgUrl = item?.photo
    ? `https://www.justsearch.net.in/assets/images/${item?.photo}`
    : `https://www.justsearch.net.in/assets/images/${item?.image1 || item?.image2 || item?.image3 || item?.image4 || item?.image5}`;
  useEffect(() => {
    if (imgUrl) {
      // const imgUrl = `https://www.justsearch.net.in/assets/images/${item?.photo}`;
      Image.getSize(
        imgUrl,
        (width, height) => {
          if (width > 0 && height > 0) {
            setAspectRatio(Number((width / height).toFixed(2))); // safe float
          }
        },
        () => {
          setAspectRatio(3 / 4); // fallback if image fails
        },
      );
    }
  }, [item?.photo]);

  const wishlistArray = Array.isArray(wishlist?.data) ? wishlist.data : [];

  const isFavourite = useMemo(
    () => wishlistArray.some((fav: any) => fav.listing_id === item.id),
    [wishlistArray, item.id],
  );
  let rating: number;

  const rawRate = Number(item?.reviews_avg_rate);

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
          setShopId(item.id);
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
              uri: imgUrl,
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
        {Number(item?.user?.verify) === 1 && (
          <Ionicons name="checkmark-circle" size={28} color="green" />
        )}
        {Number(type) === 1 && (
          <View className="w-[10%]">
            <Pressable
              onPress={() => {
                if (!isAuthenticated) {
                  showLoginAlert({
                    message: "Need to login to add to your wishlist",
                    onConfirm: () => {
                      clearToken();
                      router.push("/user/bottomNav/profile");
                    },
                  });
                  return;
                }
                toggleWishlist(
                  { listing_id: item?.id?.toString() },
                  {
                    onSuccess: () => {
                      console.log("Wishlist added successfully");
                    },
                    onError: (error) => {
                      console.log("error", error);
                      Alert.alert("Error toggling wishlist", error?.message);
                    },
                  },
                );
              }}
            >
              <Ionicons
                size={30}
                color={
                  isFavourite ? "red" : Colors[colorScheme ?? "light"].secondary
                }
                name={isFavourite ? "heart" : "heart-outline"}
              />
            </Pressable>
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
            <Text className="text-pink-700 font-semibold text-xs">
              {item?.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Location Section */}
      <Text className="text-secondary-content my-4 mx-3">
        <Ionicons name="location" /> {item.building_name} {item.street_name}
        {item.area}
      </Text>

      <View className="w-full items-center gap-4 my-4">
        {Number(type) === 1 && (
          <View className="w-[90%] bg-primary rounded-lg py-2 px-4">
            <Pressable onPress={() => openInGoogleMaps(latitude, longitude)}>
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
          <Pressable onPress={() => dialPhone(item?.phone_number)}>
            <View className=" text-xl text-center flex-row py-1 gap-2 justify-center">
              <Ionicons size={20} name="call" color={"white"} />
              <Text className="text-[#ffffff] font-semibold">Contact Now</Text>
            </View>
          </Pressable>
        </View>
        <View className="w-[90%] bg-primary rounded-lg py-2 px-4">
          <Pressable
            onPress={() => {
              startChat(item?.id, {
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
