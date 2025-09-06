import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, Dimensions, Image, ScrollView, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Carousel from "react-native-reanimated-carousel";
import ShposCard from "@/components/cards/PremiumShopsCard";
import { MY_LISTING_URL } from "@/constants/apis";
import { useSuspenceData } from "@/query/getAllSuspense";
import { useShopIdStore } from "@/store/shopIdStore";
import { queryClient } from "../_layout";

const { width } = Dimensions.get("window");

export default function TabOneScreen() {
  const { premiumshops } = useLocalSearchParams();
  const setShopId = useShopIdStore((state) => state.setShopId);
  const router = useRouter();

  const premiumShopId = Array.isArray(premiumshops)
    ? premiumshops[0]
    : premiumshops;

  const { data: banner } = useSuspenceData(
    MY_LISTING_URL.url,
    MY_LISTING_URL.key,
    premiumShopId,
  );
  useEffect(() => {
    setShopId(premiumShopId);
  }, [setShopId, premiumShopId]);
  const listing = banner?.data?.listing;

  // Show alert and early return if listing not found
  if (!listing) {
    Alert.alert(
      "Listing not found",
      "This listing was not found or approval pending.",
      [
        {
          text: "Go Back",
          onPress: () => router.replace("/user/bottomNav"),
          style: "default",
        },
      ],
    );
  }

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: [
        "suspense-data",
        premiumShopId,
        `${MY_LISTING_URL.url}${premiumShopId}`,
      ],
    });
  }, [premiumShopId]);

  const caraouselImg = useMemo(() => {
    return [
      { image: banner?.data?.listing?.photo },
      { image: banner?.data?.listing?.image1 },
      { image: banner?.data?.listing?.image2 },
      { image: banner?.data?.listing?.image3 },
      { image: banner?.data?.listing?.image4 },
      { image: banner?.data?.listing?.image5 },
    ].filter((item: { image: string }) => item?.image?.split(".").length > 1);
  }, [banner]);

  const [validImages, setValidImages] = useState(caraouselImg);

  const handleImageError = (failedImageUri: string) => {
    setValidImages((prev) =>
      prev.filter(
        (img) =>
          `https://www.justsearch.net.in/assets/images/${img.image}` !==
          failedImageUri,
      ),
    );
  };

  useEffect(() => {
    setValidImages(caraouselImg);
  }, [caraouselImg]);

  if (!listing) return null;
  return (
    <ScrollView>
      <View className="flex-1 items-center">
        <View className="flex-1 justify-center">
          <GestureHandlerRootView>
            <Carousel
              key={premiumShopId}
              loop
              width={width}
              height={360}
              autoPlay={true}
              autoPlayInterval={5000}
              data={validImages}
              scrollAnimationDuration={1000}
              mode="parallax"
              renderItem={({ item }) => {
                const uri = `https://www.justsearch.net.in/assets/images/${item?.image}`;
                return (
                  <View className="w-[100%] self-center">
                    <Image
                      className="w-[100%] h-[400px] rounded-lg"
                      source={{ uri }}
                      resizeMode="cover"
                      onError={() => handleImageError(uri)}
                    />
                  </View>
                );
              }}
            />
          </GestureHandlerRootView>
        </View>
        <ShposCard item={banner?.data?.listing} />
      </View>
    </ScrollView>
  );
}
