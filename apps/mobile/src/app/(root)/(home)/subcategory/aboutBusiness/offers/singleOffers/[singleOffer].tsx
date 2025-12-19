import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useCallback } from "react";
import {
  Alert,
  BackHandler,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import RenderHTML from "react-native-render-html";
import LoginRedirect from "@/components/cards/LoginRedirect";
import Review from "@/components/forms/review";
import { OfferReviewForm } from "@/features/offer/forms/create/OfferReviewForm";
import { trpc } from "@/lib/trpc";
import { useStartOfferChat } from "@/query/startOfferChat";
import { dialPhone } from "@/utils/getContact";

const { width } = Dimensions.get("window");

export default function TabOneScreen() {
  const { singleOffer } = useLocalSearchParams();
  const { mutate: startOfferChat } = useStartOfferChat();
  const router = useRouter();
  const singleOfferId = Array.isArray(singleOffer)
    ? singleOffer[0]
    : singleOffer;
  const { data } = useQuery(
    trpc.businessrouter.singleOffer.queryOptions({
      offerId: Number(singleOfferId),
    }),
  );
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (data?.businessId) {
          router.replace({
            pathname: "/(root)/(home)/subcategory/aboutBusiness/[premiumshops]",
            params: { premiumshops: String(data.businessId) },
          });
        } else {
          router.replace("/(root)/(home)/home");
        }

        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }, [data?.businessId, router]),
  );
  console.log(
    "data of single offer in [singleOffer].tsx file line no 28",
    JSON.stringify(data, null, 2),
  );
  const { data: authenticated } = useQuery(trpc.auth.verifyauth.queryOptions());

  return (
    <>
      <Stack.Screen
        options={{
          title: data?.name,
        }}
      />
      <ScrollView className="flex-1">
        <View className=" justify-center gap-4">
          <Carousel
            loop
            width={width}
            height={300}
            autoPlay={true}
            autoPlayInterval={4000}
            data={data?.photos ?? ["1"]}
            scrollAnimationDuration={1000}
            renderItem={() => (
              <View className="relative bg-base-200">
                <View className="relative h-[300px] mx-auto mt-2 w-[60%] bg-base-200 ">
                  <Image
                    className="w-full rounded-lg aspect-[3/4]"
                    source={{
                      uri: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC5GqGqODTAQhCbZtEwK2EMiGE91vkaXT-Iw&s`, // change image when upload on cloudinary
                    }}
                  />
                  <Text className="absolute bg-error text-secondary mt-8 pl-8 pr-3 rounded-r-md t-10">
                    -{data?.discountPercent}%
                  </Text>
                </View>
              </View>
            )}
          />
          <View className="p-8 bg-base-200 ">
            <View>
              <Text className="text-secondary text-lg mb-2">
                {data?.shopName}
              </Text>
              <Text className="text-secondary text-[24px] font-semibold mb-2">
                {data?.name}
              </Text>
              <RenderHTML
                contentWidth={width}
                source={{ html: data?.description || "" }}
                tagsStyles={{
                  body: { color: "#ff6600" }, // Orange text everywhere
                }}
              />
              <View className="flex-row items-center gap-4">
                <Text className="text-primary text-lg ">
                  ₹{data?.finalPrice}
                </Text>
                <Text className="text-secondary line-through">
                  ₹{data?.rate}
                </Text>
              </View>
            </View>
            <View className="w-full items-center gap-4 my-4">
              <View className="w-[100%] bg-error-content rounded-lg py-2 px-4">
                <Pressable
                  onPress={() => {
                    router.navigate({
                      pathname:
                        "/(root)/(home)/subcategory/aboutBusiness/[premiumshops]",
                      params: { premiumshops: String(data?.businessId) },
                    });
                  }}
                >
                  <Text className="text-error font-semibold text-xl text-center ">
                    View Shop Details
                  </Text>
                </Pressable>
              </View>
              <View className="flex-row w-[100%] justify-center gap-6">
                <View className="w-[45%] bg-primary rounded-lg px-4 py-2">
                  <Pressable
                    onPress={() => {
                      startOfferChat(
                        {
                          listingId: String(data?.businessId),
                          offerId: String(data?.id),
                        },
                        {
                          onSuccess: (res) => {
                            if (res?.chat_session_id) {
                              router.push({
                                pathname: "/(root)/chats", //TODO: add real chats redirect
                                params: {
                                  chat: res?.chat_session_id.toString(),
                                },
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
                              // console.error('Failed to start chat:', res);
                            }
                          },
                        },
                      );
                    }}
                  >
                    <View className=" text-xl text-center flex-row py-1 gap-2 justify-center">
                      <Ionicons
                        size={20}
                        name="chatbox-ellipses"
                        color={"white"}
                      />
                      <Text className="text-[#ffffff] font-semibold">
                        Chat Now
                      </Text>
                    </View>
                  </Pressable>
                </View>
                <View className="w-[45%] bg-primary rounded-lg py-2 px-4">
                  <Pressable onPress={() => dialPhone(data?.phoneNo ?? "")}>
                    <View className=" text-xl text-center flex-row py-1 gap-2 justify-center">
                      <Ionicons size={20} name="call" color={"white"} />
                      <Text className="text-[#ffffff] font-semibold">
                        Contact Now
                      </Text>
                    </View>
                  </Pressable>
                </View>
              </View>
            </View>
            {!authenticated?.success && <LoginRedirect />}
            {authenticated?.success && (
              <OfferReviewForm offerId={Number(singleOfferId ?? 0)} />
            )}
            <View className="">
              <Review rating={data?.rating} />
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
