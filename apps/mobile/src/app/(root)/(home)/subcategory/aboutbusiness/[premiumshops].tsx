import { useQuery } from "@tanstack/react-query";
import { AdvancedImage } from "cloudinary-react-native";
import { useLocalSearchParams } from "expo-router";
import { Dimensions, ScrollView, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Loading } from "@/components/ui/Loading";
import ShposCard from "@/features/business/show/PremiumShopsCard";
import { cld } from "@/lib/cloudinary";
import { trpc } from "@/lib/trpc";
import { useShopIdStore } from "@/store/shopIdStore";

const { width } = Dimensions.get("window");

export default function TabOneScreen() {
  const { premiumshops } = useLocalSearchParams();
  const setShopId = useShopIdStore((state) => state.setShopId);

  const { data, isLoading } = useQuery(
    trpc.businessrouter.singleShop.queryOptions({
      businessId: Number(premiumshops),
    }),
  );
  console.log("premium shop is ==================>", premiumshops);
  setShopId(Array.isArray(premiumshops) ? premiumshops[0] : premiumshops);
  if (isLoading) {
    return <Loading position="center" size={"large"} />;
  }

  return (
    <ScrollView>
      <View className="flex-1 items-center">
        <View className="flex-1 justify-center">
          <Carousel
            key={data?.id}
            loop
            width={width}
            height={360}
            autoPlay={true}
            autoPlayInterval={5000}
            data={data?.businessPhotos ?? []}
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
        </View>
        <ShposCard item={data} />
      </View>
    </ScrollView>
  );
}
