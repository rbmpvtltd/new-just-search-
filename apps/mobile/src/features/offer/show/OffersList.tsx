import Ionicons from "@expo/vector-icons/Ionicons";
import { AdvancedImage } from "cloudinary-react-native";
import { router } from "expo-router";
import {
  Alert,
  Button,
  Platform,
  Pressable,
  Share,
  Text,
  View,
} from "react-native";
import type { OfferProductHitType } from "@/app/(root)/(offer)/allOffers";
import { cld } from "@/lib/cloudinary";

export default function OffersList({ item }: { item: OfferProductHitType }) {
  const onShare = async () => {
    try {
      const shareUrl = `https://web-test.justsearch.net.in/subcategory/aboutBusiness/offers/singleOffers/${item.navigationId}`;

      const result = await Share.share(
        {
          title: item?.name ?? "Check this offer",
          message:
            Platform.OS === "android"
              ? `${item?.name ?? "Amazing offer"}\n\n${shareUrl}`
              : (item?.name ?? "Amazing offer"),
          url: shareUrl, // iOS uses this
        },
        {
          dialogTitle: "Share Offer",
        },
      );

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // iOS specific (AirDrop, WhatsApp, etc.)
          console.log("Shared via:", result.activityType);
        } else {
          console.log("Shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error: any) {
      Alert.alert("Error", error?.message ?? "Unable to share");
    }
  };

  return (
    <View className="bg-base-200 rounded-lg w-[90%] shadow-lg mx-auto my-2">
      {/* Image Section */}
      <View className="relative h-auto mx-auto mt-2 w-[60%]">
        <Pressable
          onPress={() => {
            router.push({
              pathname:
                "/(root)/(home)/subcategory/aboutBusiness/offers/singleOffers/[singleOffer]",
              params: { singleOffer: item.navigationId },
            });
          }}
        >
          <AdvancedImage
            cldImg={cld.image(item.photo[0] || "")}
            className="w-full aspect-[3/4] rounded-lg"
          />
  
          {item.discountPercent > 0 && (
            <Text className="absolute bg-error text-secondary mt-8 pl-8 pr-3 rounded-r-md">
              -{item.discountPercent}%
            </Text>
          )}
        </Pressable>
      </View>

      <View className="flex-row items-center justify-between w-full mt-4 px-4">
        <Text
          className="text-secondary text-2xl font-semibold flex-1 pr-2"
          numberOfLines={2}
        >
          {item?.name ?? "Unknown"}
        </Text>

        <Pressable hitSlop={10} onPress={onShare}>
          <Ionicons name="share-social" size={22} color="black" />
        </Pressable>
      </View>

      {/* <View className="h-auto w-full mt-4 px-4">
        <Text className="text-secondary text-lg ">
          {item?.item?.listing_name}
        </Text>
      </View> */}
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
              router.push({
                pathname:
                  "/(root)/(home)/subcategory/aboutBusiness/offers/singleOffers/[singleOffer]",
                params: { singleOffer: item.navigationId },
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
