import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import {
  Alert,
  Platform,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Pressable } from "react-native-gesture-handler";
import MapView, { Marker } from "react-native-maps";
import Colors from "@/constants/Colors";
import { useToggleWishlist, useWishlist } from "@/query/favorite";
import { useStartChat } from "@/query/startChat";
import { useAuthStore } from "@/store/authStore";
import { showLoginAlert } from "@/utils/alert";
import { dialPhone } from "@/utils/getContact";
import { openInGoogleMaps } from "@/utils/getDirection";
import Review from "../../../components/forms/review";
import { OutputTrpcType } from "@/lib/trpc";

type ShopCardType = OutputTrpcType["businessrouter"]["singleShop"] 



const ShposCard = ({ item: shop }: {item : ShopCardType}) => {

  const router = useRouter();
  const { mutate: startChat} = useStartChat();
  const latitude = Number(shop?.latitude?.split(",").shift());
  const longitude = Number(shop?.longitude?.split(",").pop());
  const isAuthenticated = useAuthStore((state) => state.authenticated);
  const clearToken = useAuthStore((state) => state.clearToken);
  const { mutate: toggleWishlist } = useToggleWishlist();


  return (
    <View className="w-[93%] mx-auto mt-6 p-4 rounded-2xl bg-base-200 shadow-lg gap-4">
      <View className="flex-row items-center justify-between w-[100%]">
        <View className="w-[80%]">
          <Text className="text-xl font-bold text-secondary ">
            {shop?.name}
          </Text>
        </View>
        {/* {Number(item?.user?.verify) === 1 && (
          <Ionicons name="checkmark-circle" size={28} color="green" />
        )} */}
        <View className="w-[10%] ">
          <Pressable
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
                { listing_id: shop?.id?.toString() },
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
            {/* <Ionicons
              size={30}
              color={
                isFavourite ? "red" : Colors[colorScheme ?? "light"].secondary
              }
              name={isFavourite ? "heart" : "heart-outline"}
            /> TODO : ==> uncomment and set initial favourite when send from backend*/}
          </Pressable>
        </View>
      </View>
      <View className="mb-1">
        <Text className="text-secondary text-lg">{shop?.description} </Text>
      </View>
      <View className="mb-1 flex-row items-center gap-3">
        <Text className="text-primary text-sm ">
          <Ionicons name="location-outline" size={16} className="ml-1" />
        </Text>
        <Text className=" text-secondary flex-1 flex-wrap">
          {[
            shop?.buildingName,
            shop?.streetName,
            shop?.landMark,
            shop?.area,
          ]
            .filter(Boolean)
            .join(", ")}
        </Text>
      </View>

      <View className="mb-1 flex flex-row items-center gap-3">
        <Text className="text-primary text-sm ">
          <Ionicons name="call-outline" size={16} className="ml-1" />
        </Text>
        <Pressable onPress={() => dialPhone(shop?.phoneNumber ?? "")}>
          <Text className=" text-secondary">{shop?.phoneNumber}</Text>
        </Pressable>
      </View>
      <View className="mb-1 flex flex-row items-center gap-3">
        <Text className="text-success text-sm">
          <Ionicons name="logo-whatsapp" size={16} className="ml-1" />
        </Text>
        <Text className=" text-secondary">
          {shop?.whatsappNo ? shop?.whatsappNo : "Not Available"}
        </Text>
      </View>

      <View className="mb-1 flex flex-row items-center gap-3">
        <Text className="text-primary text-sm">
          <Ionicons name="mail-outline" size={16} className="ml-1" />
        </Text>
        <Text className=" text-secondary">
          {shop?.email ? shop?.email : "Not Available"}
        </Text>
      </View>

      <View className="mb-1 flex-row items-center gap-2">
        <Text className="text-primary text-sm">
          <Ionicons name="bicycle-outline" size={16} className="ml-1" />
        </Text>
        <Text className=" text-secondary font-bold">Home Delivery:</Text>
        <Text className=" text-secondary">
          {!shop?.homeDelivery ? "Available" : "Not Available"}
        </Text>
      </View>
      <View className="mb-1 flex-row flex-wrap gap-2">
        <Text className=" text-secondary font-bold">Specialities:</Text>
        <Text className=" text-secondary">{shop?.specialities}</Text>
      </View>

      <View className="flex-row flex-wrap gap-2 ">
        <View>
          <Text className=" text-secondary w-full mb-1 font-bold">
            Categories:
          </Text>
        </View>
       
          <TouchableOpacity className="bg-success-content rounded-lg py-2 px-3 mb-1">
            <Text className="text-success font-semibold text-xs">
              {shop?.category}
            </Text>
          </TouchableOpacity>
        
      </View>

      <View className="flex-row flex-wrap gap-2 ">
        <View>
          <Text className=" text-secondary w-full mb-1 font-bold">
            Sub Categories:
          </Text>
        </View>
        {shop?.subcategories?.map((sub, index) => (
          <TouchableOpacity
            className="bg-error-content rounded-lg py-2 px-3 mb-1"
            key={index.toString()}
          >
            <Text className="text-pink-700 font-semibold text-xs">
              {sub}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* <View className="p-4">
        {Object.entries(schedules).map(([day, value]) => {
          const open = value?.opens_at;
          const close = value?.closes_at;

          const timeLabel = open && close ? `${open} - ${close}` : "Closed";
          return (
            <View
              key={day}
              className="flex-row justify-between py-2 border-b border-gray-200"
            >
              <Text className="font-medium text-secondary">{day}</Text>
              <Text
                className={` ${timeLabel === "Closed" ? "text-secondary" : "text-secondary"}`}
              >
                {timeLabel}
              </Text>
            </View>
          );
        })}
      </View>  TODO : ==> Set schedule when dbsync is complete */} 

      <View className="flex-row w-full justify-center gap-2">
        {/* Chat Now */}
        <View className="flex-1 bg-primary rounded-lg px-2 py-2">
          <Pressable
            onPress={() => {
              startChat(String(shop?.id), {
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
            <View className="flex-row items-center justify-center gap-1">
              <Ionicons size={20} name="chatbox-ellipses" color={"white"} />
              <Text className="text-secondary font-semibold text-sm">
                Chat Now
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Contact Now */}
        <View className="flex-1 bg-primary rounded-lg px-2 py-2">
          <Pressable onPress={() => dialPhone(shop?.phoneNumber ?? "")}>
            <View className="flex-row items-center justify-center gap-1">
              <Ionicons size={20} name="call" color={"white"} />
              <Text className="text-secondary font-semibold text-sm">
                Contact Now
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Get Direction */}
        <View className="flex-1 bg-primary rounded-lg px-2 py-2">
          <Pressable onPress={() => openInGoogleMaps(String(latitude), String(longitude))}>
            <View className="flex-row items-center justify-center gap-1">
              <Ionicons size={20} name="location" color={"white"} />
              <Text className="text-secondary font-semibold text-sm">
                Get Direction
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      {latitude && longitude ? (
        <View style={{ height: 400, borderRadius: 12, overflow: "hidden" }}>
          {Platform.OS !== "web" ? (
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >
              <Marker
                coordinate={{
                  latitude: latitude,
                  longitude: longitude,
                }}
                pinColor="red"
              />
            </MapView>
          ) : (
            <Text></Text>
          )}
        </View>
      ) : (
        <Text className="text-red-500 font-semibold text-center mt-4">
          Location not available
        </Text>
      )}

      <Text className="text-secondary text-3xl">
        Review Submit Form Pending
      </Text>
      <View>
        <Review rating={shop?.rating} />
      </View>
    </View>
  );
};

export default ShposCard;
