import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Alert, Dimensions, Image, ScrollView, Text, View } from "react-native";
import {
  GestureHandlerRootView,
  Pressable,
} from "react-native-gesture-handler";
import Carousel from "react-native-reanimated-carousel";
import RenderHtml from "react-native-render-html";
import Review from "@/components/forms/review";
import { SINGLE_PRODUCT_URL } from "@/constants/apis";
import { useSuspenceData } from "@/query/getAllSuspense";
import { useStartChat } from "@/query/startChat";
import { useAuthStore } from "@/store/authStore";
import { showLoginAlert } from "@/utils/alert";
import { dialPhone } from "@/utils/getContact";
import { openInGoogleMaps } from "@/utils/getDirection";

const { width } = Dimensions.get("window");

export default function TabOneScreen() {
  const { singleProduct } = useLocalSearchParams();
  const isAuthenticated = useAuthStore((state) => state.authenticated);
  const clearToken = useAuthStore((state) => state.clearToken);
  const { mutate: startChat } = useStartChat();

  const productId = Array.isArray(singleProduct)
    ? singleProduct[0]
    : singleProduct;

  const { data } = useSuspenceData(
    SINGLE_PRODUCT_URL.url,
    SINGLE_PRODUCT_URL.key,
    productId,
  );

  const latitude = Number(data?.listing?.latitude.split(",").shift());
  const longitude = Number(data?.listing?.longitude.split(",").pop());

  const caraouselImg = [
    { image: data?.product?.image1 },
    { image: data?.product?.image2 },
    { image: data?.product?.image3 },
    { image: data?.product?.image4 },
    { image: data?.product?.image5 },
  ].filter((item: { image: string }) => item?.image?.split(".").length > 1);

  return (
    <>
      <Stack.Screen
        options={{
          title: data?.product?.product_name,
        }}
      />
      <ScrollView>
        <View className="flex-1 items-center">
          <View className="flex-1 justify-center gap-4">
            <GestureHandlerRootView>
              <Carousel
                loop
                width={width}
                height={400}
                autoPlay={true}
                autoPlayInterval={4000}
                data={caraouselImg}
                scrollAnimationDuration={1000}
                renderItem={({ item }) => (
                  <View className="relative  h-[450px]  mx-auto bg-base-200 w-[100%] ">
                    <Image
                      className="w-[80%] mx-auto rounded-lg aspect-[3/4]  self-end"
                      source={{
                        uri: `https://www.justsearch.net.in/assets/images/${item?.image}`,
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
                    {data?.product?.listing?.name}
                  </Text>
                  <Text className="text-secondary text-[24px] font-semibold mb-4">
                    {data?.product?.product_name}
                  </Text>
                  <RenderHtml
                    contentWidth={width}
                    source={{ html: data?.product?.product_description || "" }}
                    tagsStyles={{
                      body: { color: "#ff6600" }, // Orange text everywhere
                    }}
                  />

                  <Text className="text-center text-primary text-[24px]">
                    ₹ {data?.product?.rate}
                  </Text>
                </View>
                <View className="w-full items-center gap-4 my-4">
                  <View className="w-[100%] bg-primary rounded-lg py-2 px-4">
                    <Pressable
                      onPress={() => openInGoogleMaps(latitude, longitude)}
                    >
                      <Text className="text-[#fff] font-semibold text-xl text-center ">
                        Get Direction To Shop
                      </Text>
                    </Pressable>
                  </View>
                  <View className="w-[100%] bg-primary rounded-lg py-2 px-4">
                    <Pressable
                      onPress={() => dialPhone(data?.listing?.phone_number)}
                    >
                      <Text className="text-[#fff] font-semibold text-xl text-center ">
                        Contact Now
                      </Text>
                    </Pressable>
                  </View>
                  <View className="w-[100%] bg-primary rounded-lg py-2 px-4">
                    <Pressable
                      onPress={() => {
                        if (!isAuthenticated) {
                          showLoginAlert({
                            message: "Need to login to chat on your behalf",
                            onConfirm: () => {
                              clearToken();
                              router.replace("/user/bottomNav/profile");
                            },
                          });
                        } else {
                          startChat(data?.listing?.id, {
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
                                        router.replace(
                                          "/user/bottomNav/profile",
                                        );
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
            </GestureHandlerRootView>
            <View className="mx-4 p-4 rounded-lg bg-base-200 mb-10 flex-shrink">
              <Review listingId={data?.listing?.id} />
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
