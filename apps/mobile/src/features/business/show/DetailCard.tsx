import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { memo, useMemo, useState } from "react";
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
import { useToggleWishlist, useWishlist } from "@/query/favorite";
import { useStartChat } from "@/query/startChat";
import { useAuthStore } from "@/store/authStore";
import { useShopIdStore } from "@/store/shopIdStore";
import { dialPhone } from "@/utils/getContact";
import { openInGoogleMaps } from "@/utils/getDirection";
import { OutputTrpcType, trpc } from "@/lib/trpc";
import Favourite from "../shared/FaouritBtn";
import AvatarWithFallback from "@/components/ui/AvatarWithFallback";
import Colors from "@/constants/Colors";
import { showLoginAlert } from "@/utils/alert";

type DetailCardType =
  OutputTrpcType["subcategoryRouter"]["businessesByCategoryInfinate"]["data"][number];

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
  const { setShopId } = useShopIdStore();
  const colorScheme = useColorScheme()
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
     <Pressable
      onPress={() => {
        setShopId(String(item.id));
        router.navigate({
          pathname: "/(root)/(home)/subcategory/aboutBusiness/[premiumshops]",
          params: { premiumshops: item.id.toString() },
        });
      }}
    >
      <View
        className="bg-base-100 dark:bg-base-200 h-auto rounded-lg shadow-lg m-4"
        style={{
          backgroundColor: Colors[colorScheme ?? "light"]["base-200"],
        }}
      >
        <View className="flex-row p-3 ">
          <View>
            <AvatarWithFallback
              uri={"https://www.justsearch.net.in/assets/images/banners/ZmQkEttf1759906394.png"} // TODO : change image when upload on cloudinary
              imageClass="w-[150px] h-[180px] rounded-lg"
              iconClass="items-center justify-center"
              imageStyle={{ resizeMode: "stretch" }}
            />
          </View>
          <View className="flex-1 my-1 mx-2">
            <View className="flex-row items-center justify-between">
              {/* {Number(item?.user?.verify) === 1 && (
                <View className="bg-info py-2 px-3 rounded-lg ">
                  <Text className="text-[#fff] text-sm font-medium">
                    Verified
                  </Text>
                </View>
              )} */}
              {Number(type) === 1 && (
                <Pressable
                  className=""
                  onPress={() => {
                    if (!isAuthenticated) {
                      showLoginAlert({
                        message: "Need to login to add to your wishlist",
                        onConfirm: () => {
                          clearToken();
                          router.push("/(root)/profile");
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
                          Alert.alert(
                            "Error toggling wishlist",
                            error?.message,
                          );
                        },
                      },
                    );
                  }}
                >
                  <Ionicons
                    size={26}
                    color={
                      isFavourite
                        ? "red"
                        : Colors[colorScheme ?? "light"].secondary
                    }
                    name={isFavourite ? "heart" : "heart-outline"}
                  />
                </Pressable>
              )}
            </View>
            <View className="my-2">
              <StarRating
                rating={rating}
                onChange={() => {}}
                starSize={18}
                enableSwiping={false}
              />
              {/* <View className="flex-row items-center gap-1">
                <Ionicons name="star" size={16} color="#fbbf24" />
                <Text className="text-secondary text-sm font-medium">
                  {rating}
                </Text>
              </View> */}
            </View>
            <View className="mx-2">
              <Text className="text-secondary text-lg font-semibold">
                {item.name}
              </Text>
            </View>
            <View className="flex-row gap-2 mt-2 flex-wrap">
              <TouchableOpacity
                className="bg-success-content rounded-lg py-2 px-1"
                onPress={() => {
                  setShopId(String(item.id));
                  router.navigate({
                    pathname: "/(root)/(home)/subcategory/aboutBusiness/[premiumshops]",
                    params: { premiumshops: item.id.toString() },
                  });
                }}
              >
                <Text className="text-success font-semibold text-xs">
                  {category}
                </Text>
              </TouchableOpacity>
              {subcategories
                ?.slice(0, 2)
                .map((sub: any, index: number) => (
                  <TouchableOpacity
                    key={index.toString()}
                    className="bg-error-content rounded-lg py-2 px-2 mb-1"
                    onPress={() => {
                      setShopId(String(item.id));
                      router.navigate({
                        pathname: "/(root)/(home)/subcategory/aboutBusiness/[premiumshops]",
                        params: { premiumshops: item.id.toString() },
                      });
                    }}
                  >
                    <Text className="text-pink-700 font-semibold text-xs">
                      {sub}
                    </Text>
                  </TouchableOpacity>
                ))}
              {item.subcategories?.length > 2 && (
                <TouchableOpacity
                  className="bg-base-100 rounded-lg py-2 px-4 mb-1"
                  onPress={() => {
                    setShopId(String(item.id));
                    router.navigate({
                      pathname: "/(root)/(home)/subcategory/aboutBusiness/[premiumshops]",
                      params: { premiumshops: item.id.toString() },
                    });
                  }}
                >
                  <Text className="text-secondary font-semibold text-xs">
                    + More
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        {/* <View className="w-full mx-4">
        <Text className="text-secondary text-lg font-semibold ">
          {item.name}
        </Text>
      </View> */}
        <View className="w-[80%] mx-4 flex-row items-center gap-2 ">
          <Text className="text-secondary-content flex items-center justify-center">
            <Ionicons
              name="location"
              size={22}
              color={colorScheme === "dark" ? "#F87171" : "#DC2626"}
            />
          </Text>
          <Text className="text-secondary text-lg font-semibold ">
            {item.buildingName} {item.streetName}
            {item.area}
          </Text>
        </View>

        <View className="w-full mx-4 gap-6 m-4 flex-row items-center ">
          <View className="rounded-lg bg-primary p-1">
            <Pressable
              onPress={() => {
                setShopId(String(item.id));
                router.navigate({
                  pathname: "/(root)/(home)/subcategory/aboutBusiness/[premiumshops]",
                  params: { premiumshops: item.id.toString() },
                });
              }}
            >
              <View className=" text-xl text-center flex-row py-1 gap-2 px-3 justify-center">
                <Ionicons size={20} name="chatbox-ellipses" color={"white"} />
              </View>
            </Pressable>
          </View>

          <View className="rounded-lg bg-primary p-1">
            <Pressable
              onPress={() => {
                setShopId(String(item.id));
                router.navigate({
                  pathname: "/(root)/(home)/subcategory/aboutBusiness/[premiumshops]",
                  params: { premiumshops: item.id.toString() },
                });
              }}
            >
              <View className=" text-xl text-center flex-row py-1 gap-2 px-3 justify-center">
                <Ionicons size={20} name="call" color={"white"} />
              </View>
            </Pressable>
          </View>
          {Number(type) === 1 && (
            <View className="rounded-lg bg-primary p-1">
              <Pressable
                onPress={() => {
                  setShopId(String(item.id));
                  router.navigate({
                    pathname: "/(root)/(home)/subcategory/aboutBusiness/[premiumshops]",
                    params: { premiumshops: item.id.toString() },
                  });
                }}
              >
                <View className=" text-xl text-center flex-row py-1 gap-2 px-3 justify-center">
                  <Ionicons size={20} name="location" color={"white"} />
                </View>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export const MemoizedDetailCard = memo(DetailCard);
