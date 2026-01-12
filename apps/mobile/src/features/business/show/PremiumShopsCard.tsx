import Ionicons from "@expo/vector-icons/Ionicons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
  Alert,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import LoginRedirect from "@/components/cards/LoginRedirect";
import { Loading } from "@/components/ui/Loading";
import { useAuthStore } from "@/features/auth/authStore";
import { type OutputTrpcType, trpc } from "@/lib/trpc";
import { useToggleWishlist } from "@/query/favorite";
import { showLoginAlert } from "@/utils/alert";
import { dialPhone } from "@/utils/getContact";
import { openInGoogleMaps } from "@/utils/getDirection";
import Review from "../../../components/forms/review";
import ReviewForm from "../create/add-business/forms/ReviewForm";
import Colors from "@/constants/Colors";
import { useState } from "react";

type ShopCardType = OutputTrpcType["businessrouter"]["singleShop"] | undefined;

const ShposCard = ({ item: shop }: { item: ShopCardType }) => {
  const router = useRouter();
  const latitude = Number(shop?.latitude);
  const longitude = Number(shop?.longitude);
  const { data } = useQuery(trpc.auth.verifyauth.queryOptions());
  const colorScheme = useColorScheme()
  const [fav, setFav] = useState<boolean>(shop?.isFavourite ?? false)

  const clearToken = useAuthStore((state) => state.clearToken);
  const mutation = useMutation(
    trpc.businessrouter.toggleFavourite.mutationOptions({
      onSuccess: (data) => {
        console.log("favourit toggle successfully",data)
      },
      onError: (err) => {
        setFav((prev) => !prev);
        if (err.shape?.data.httpStatus === 401) {
          Alert.alert(
            "Login Required",
            "You need to login to use favorites feature",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Login",
                onPress: () => {
                  clearToken();
                  router.navigate("/(root)/profile");
                },
              },
            ],
          );
        }
      },
    }),
  );

  const handleFavClick = () => {
    setFav((prev) => !prev);
    mutation.mutate({businessId:shop?.id ?? 0});
  };

  const {
    mutateAsync: createConversation,
    isPending,
    error,
    isError,
  } = useMutation(trpc.chat.createConversation.mutationOptions());

  const handleChat = async () => {
    const conv = await createConversation({
      receiverId: Number(shop?.userId),
    });
    // setTimeout(() => {
    // router.push(`/(root)/chats/private-chat/${conv?.id}`);
    router.push(`/(root)/(home)/chat/${conv?.id}`);

    // }, 5000);
  };
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
           onPress={handleFavClick}
          >
            <Ionicons
              size={30}
              color={
                fav ? "red" : Colors[colorScheme ?? "light"].secondary
              }
              name={fav ? "heart" : "heart-outline"}
            />
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
          {[shop?.buildingName, shop?.streetName, shop?.landMark, shop?.address]
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
            <Text className="text-pink-700 font-semibold text-xs">{sub}</Text>
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
            disabled={isPending}
            onPress={() => {
              if (isError) {
                Alert.alert(
                  "Authentication Required",
                  "You must be logged in to use chat.",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Login",
                      onPress: () => router.navigate("/(root)/profile"),
                    },
                  ],
                );
              } else {
                handleChat();
              }
            }}
          >
            <View className="flex-row items-center justify-center gap-1">
              <Ionicons size={20} name="chatbox-ellipses" color={"white"} />
              <Text className="text-white font-semibold text-sm">
                {isPending ? <Loading size={"small"} /> : "Chat Now"}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Contact Now */}
        <View className="flex-1 bg-primary rounded-lg px-2 py-2">
          <Pressable onPress={() => dialPhone(shop?.phoneNumber ?? "")}>
            <View className="flex-row items-center justify-center gap-1">
              <Ionicons size={20} name="call" color={"white"} />
              <Text className="text-white font-semibold text-sm">
                Contact Now
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Get Direction */}
        <View className="flex-1 bg-primary rounded-lg px-2 py-2">
          <Pressable
            onPress={() =>
              openInGoogleMaps(String(latitude), String(longitude))
            }
          >
            <View className="flex-row items-center justify-center gap-1">
              <Ionicons size={20} name="location" color={"white"} />
              <Text className="text-white font-semibold text-sm">
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

      {data?.success && <ReviewForm businessId={shop?.id ?? 0} />}

      {!data?.success && <LoginRedirect />}
      <View>
        <Review rating={shop?.rating} />
      </View>
    </View>
  );
};

export default ShposCard;
