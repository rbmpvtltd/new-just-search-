import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Dimensions, Image, ScrollView, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Carousel from "react-native-reanimated-carousel";
import ShposCard from "@/components/cards/PremiumShopsCard";
import { useQuery } from "@tanstack/react-query";
import { cld } from "@/lib/cloudinary";
import { AdvancedImage } from "cloudinary-react-native";
import { trpc } from "@/lib/trpc";
import { useShopIdStore } from "@/store/shopIdStore";
import { Loading } from "@/components/ui/Loading";

const { width } = Dimensions.get("window");

export default function TabOneScreen() {
  const { premiumshops } = useLocalSearchParams();
  const setShopId = useShopIdStore((state) => state.setShopId);

  const { data,isLoading } = useQuery(
    trpc.businessrouter.singleShop.queryOptions({
      businessId: Number(premiumshops),
    }),
  );
  setShopId(Array.isArray(premiumshops) ? premiumshops[0] : premiumshops)
  if(isLoading){
    return <Loading position="center" size={"large"}/>
  }

  // const premiumShopId = Array.isArray(premiumshops)
  //   ? premiumshops[0]
  //   : premiumshops;

  // const { data: banner } = useSuspenceData(
  //   MY_LISTING_URL.url,
  //   MY_LISTING_URL.key,
  //   premiumShopId,
  // );
  // useEffect(() => {
  //   setShopId(premiumShopId);
  // }, [setShopId, premiumShopId]);
  // const listing = banner?.data?.listing;

  // Show alert and early return if listing not found
  // if (!listing) {
  //   Alert.alert(
  //     "Listing not found",
  //     "This listing was not found or approval pending.",
  //     [
  //       {
  //         text: "Go Back",
  //         onPress: () => router.replace("/(root)/(home)/home"),
  //         style: "default",
  //       },
  //     ],
  //   );
  // }

  // useEffect(() => {
  //   queryClient.invalidateQueries({
  //     queryKey: [
  //       "suspense-data",
  //       premiumShopId,
  //       `${MY_LISTING_URL.url}${premiumShopId}`,
  //     ],
  //   });
  // }, [premiumShopId]);

  // const caraouselImg = useMemo(() => {
  //   return [
  //     { image: banner?.data?.listing?.photo },
  //     { image: banner?.data?.listing?.image1 },
  //     { image: banner?.data?.listing?.image2 },
  //     { image: banner?.data?.listing?.image3 },
  //     { image: banner?.data?.listing?.image4 },
  //     { image: banner?.data?.listing?.image5 },
  //   ].filter((item: { image: string }) => item?.image?.split(".").length > 1);
  // }, [banner]);

  // const [validImages, setValidImages] = useState(caraouselImg);

  // const handleImageError = (failedImageUri: string) => {
  //   setValidImages((prev) =>
  //     prev.filter(
  //       (img) =>
  //         `https://www.justsearch.net.in/assets/images/${img.image}` !==
  //         failedImageUri,
  //     ),
  //   );
  // };

  // useEffect(() => {
  //   setValidImages(caraouselImg);
  // }, [caraouselImg]);

  // if (!listing) return null;
  return (
    <ScrollView>
      <Stack.Screen
      options={{
        title : data?.name
      }} 
      /> 
      <View className="flex-1 items-center">
        <View className="flex-1 justify-center">
          <GestureHandlerRootView>
            <Carousel
              key={data?.id}
              loop
              width={width}
              height={360}
              autoPlay={true}
              autoPlayInterval={5000}
              data={data?.businessPhotos}
              scrollAnimationDuration={1000}
              mode="parallax"
              renderItem={({ item }) => {
                const bannerImg = cld.image(item);
                return (
                  <View className="w-[100%] self-center">
                    <AdvancedImage
                      className="w-full h-full rounded-tl-lg rounded-tr-lg object-cover"
                      style={{ width: 400, height: 400, alignSelf: "center" }}
                      cldImg={bannerImg}
                    />
                  </View>
                );
              }}
            />
          </GestureHandlerRootView>
        </View>
        <ShposCard item={data} />
      </View>
      
    </ScrollView>
  );
}
