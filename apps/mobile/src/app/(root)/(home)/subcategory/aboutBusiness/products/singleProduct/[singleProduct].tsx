import { Ionicons } from "@expo/vector-icons";
import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import {
  Pressable,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  Text,
  View,
  BackHandler,
} from "react-native";

import Carousel from "react-native-reanimated-carousel";
import RenderHtml from "react-native-render-html";
import Review from "@/components/forms/review";
import { useAuthStore } from "@/features/auth/authStore";
import { useStartChat } from "@/query/startChat";
import { showLoginAlert } from "@/utils/alert";
import { dialPhone } from "@/utils/getContact";
import { openInGoogleMaps } from "@/utils/getDirection";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { Loading } from "@/components/ui/Loading";
import LoginRedirect from "@/components/cards/LoginRedirect";
import { ProductReviewForm } from "@/features/product/forms/create/ProductReviewForm";
import { useCallback } from "react";

const { width } = Dimensions.get("window");

export default function TabOneScreen() {
  const { singleProduct } = useLocalSearchParams();
  const clearToken = useAuthStore((state) => state.clearToken);
  const { mutate: startChat } = useStartChat();

  const productId = Array.isArray(singleProduct)
    ? singleProduct[0]
    : singleProduct;

  const { data, isLoading } = useQuery(
    trpc.businessrouter.singleProduct.queryOptions({
      productId: Number(productId),
    }),
  );
  const { data: authenticated } = useQuery(trpc.auth.verifyauth.queryOptions());
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
    }, [data?.businessId]),
  );

  if (isLoading) {
    return <Loading position="center" size={"large"} />;
  }

  const latitude = Number(data?.latitude?.split(",").shift());
  const longitude = Number(data?.longitude?.split(",").pop());

  return (
    <>
      <Stack.Screen
        options={{
          title: data?.name,
        }}
      />
      <ScrollView>
        <View className="flex-1 items-center">
          <View className="flex-1 justify-center gap-4">
            <Carousel
              loop
              width={width}
              height={400}
              autoPlay={true}
              autoPlayInterval={4000}
              data={data?.photos ?? []}
              scrollAnimationDuration={1000}
              renderItem={({ item }) => (
                <View className="relative  h-[500px]  mx-auto bg-base-200 w-[100%] ">
                  <Image
                    className="w-[80%] mx-auto rounded-lg aspect-[3/4] mt-4 self-end"
                    source={{
                      uri: `https://www.justsearch.net.in/assets/images/18109401431760422232.jpeg`, // TODO : change image when upload on cloudinary
                    }}
                    resizeMode="cover"
                    onError={(e) =>
                      console.log("Image loading error:", e.nativeEvent.error)
                    }
                  />
                </View>
              )}
            />
            <View className="p-8 bg-base-200">
              <View>
                <Text className="text-secondary text-lg mb-4">
                  {data?.shopName}
                </Text>
                <Text className="text-secondary text-[24px] font-semibold mb-4">
                  {data?.name}
                </Text>
                <RenderHtml
                  contentWidth={width}
                  source={{ html: data?.description || "" }}
                  tagsStyles={{
                    body: { color: "#ff6600" }, // Orange text everywhere
                  }}
                />

                <Text className="text-center text-primary text-[24px]">
                  ₹ {data?.rate}
                </Text>
              </View>
              <View className="w-full items-center gap-4 my-4">
                <View className="w-[100%] bg-primary rounded-lg py-2 px-4">
                  <Pressable
                    onPress={() =>
                      openInGoogleMaps(String(latitude), String(longitude))
                    }
                  >
                    <Text className="text-[#fff] font-semibold text-xl text-center ">
                      Get Direction To Shop
                    </Text>
                  </Pressable>
                </View>
                <View className="w-[100%] bg-primary rounded-lg py-2 px-4">
                  <Pressable onPress={() => dialPhone(data?.phone ?? "")}>
                    <Text className="text-[#fff] font-semibold text-xl text-center ">
                      Contact Now
                    </Text>
                  </Pressable>
                </View>
                <View className="w-[100%] bg-primary rounded-lg py-2 px-4">
                  <Pressable
                    onPress={() => {
                      if (!authenticated?.success) {
                        showLoginAlert({
                          message: "Need to login to chat on your behalf",
                          onConfirm: () => {
                            clearToken();
                            router.replace("/(root)/profile");
                          },
                        });
                      } else {
                        startChat(String(data?.id), {
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
                                      router.replace("/(root)/profile");
                                    },
                                  },
                                ],
                                { cancelable: false },
                              );
                            } else {
                              router.push({
                                pathname: "/chat/[chat]",
                                params: {
                                  chat: res?.chat_session_id.toString(),
                                },
                              });
                            }
                          },
                          onError: (err) => {
                            Alert.alert("Something Went Wrong");
                            console.error("Failed to start chat:", err);
                          },
                        });
                      }
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
              </View>
            </View>
            {!authenticated?.success && <LoginRedirect />}
            {authenticated?.success && (
              <ProductReviewForm
                productId={Number(productId)}
                businessId={Number(data?.businessId)}
              />
            )}

            <View className="mx-4 p-4 rounded-lg bg-base-200 mb-10 flex-shrink">
              <Review rating={data?.rating} />
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
