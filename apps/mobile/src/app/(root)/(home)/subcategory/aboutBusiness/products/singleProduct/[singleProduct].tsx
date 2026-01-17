import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import { AdvancedImage } from "cloudinary-react-native";
import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  BackHandler,
  Dimensions,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  Text,
  useColorScheme,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import RenderHtml from "react-native-render-html";
import LoginRedirect from "@/components/cards/LoginRedirect";
import Review from "@/components/forms/review";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import TextAreaInput from "@/components/inputs/TextAreaInput";
import { Loading } from "@/components/ui/Loading";
import Colors from "@/constants/Colors";
import { useAuthStore } from "@/features/auth/authStore";
import { ProductReviewForm } from "@/features/product/forms/create/ProductReviewForm";
import { cld } from "@/lib/cloudinary";
import { trpc } from "@/lib/trpc";
import { useStartChat } from "@/query/startChat";
import { showLoginAlert } from "@/utils/alert";
import { dialPhone } from "@/utils/getContact";
import { openInGoogleMaps } from "@/utils/getDirection";

const { width } = Dimensions.get("window");

export default function TabOneScreen() {
  const colorScheme = useColorScheme();
  const { singleProduct } = useLocalSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<any>(null);

  const productId = Array.isArray(singleProduct)
    ? singleProduct[0]
    : singleProduct;

  const { data: product, isLoading } = useQuery(
    trpc.businessrouter.singleProduct.queryOptions({
      productId: Number(productId),
    }),
  );
  const { data: authenticated } = useQuery(trpc.auth.verifyauth.queryOptions());
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (product?.businessId) {
          router.replace({
            pathname: "/(root)/(home)/subcategory/aboutBusiness/[premiumshops]",
            params: { premiumshops: String(product.businessId) },
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
    }, [product?.businessId]),
  );

  const { mutateAsync: createConversation } = useMutation(
    trpc.chat.createConversation.mutationOptions(),
  );

  async function handleChat() {
    const conv = await createConversation({
      receiverId: Number(product?.userId),
    });
    setConversation(conv);
  }
  const { data, error } = useSubscription(
    trpc.chat.onMessage.subscriptionOptions({
      conversationId: conversation?.id,
      // messageId: String(allMessages[allMessages.length -1]?.id),
    }),
  );

  const { mutate, isPending } = useMutation(
    trpc.chat.sendMessage.mutationOptions(),
  );
  if (isLoading) {
    return <Loading position="center" size={"large"} />;
  }

  const latitude = Number(product?.latitude);
  const longitude = Number(product?.longitude);

  const onShare = async () => {
    try {
      const shareUrl = `https://web-test.justsearch.net.in/subcategory/aboutBusiness/products/singleProduct/${product?.id}`;

      const result = await Share.share(
        {
          title: product?.name ?? "Check this Product",
          message:
            Platform.OS === "android"
              ? `${product?.name ?? "Amazing Product"}\n\n${shareUrl}`
              : (product?.name ?? "Amazing Product"),
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
    <>
      <Stack.Screen
        options={{
          title: product?.name,
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
              data={product?.photos ?? []}
              scrollAnimationDuration={1000}
              renderItem={({ item }) => (
                <View className="relative  h-[500px]  mx-auto bg-base-200 w-[100%] ">
                  {/* <Image
                    className="w-[80%] mx-auto rounded-lg aspect-[3/4] mt-4 self-end"
                    source={{
                      uri: `https://www.justsearch.net.in/assets/images/18109401431760422232.jpeg`, //}}
                    resizeMode="cover"
                    onError={(e) =>
                      console.log("Image loading error:", e.nativeEvent.error)
                    }
                  /> */}
                  <AdvancedImage
                    cldImg={cld.image(item || "")}
                    className="w-[80%] mx-auto rounded-lg aspect-[3/4] mt-4 self-end"
                    resizeMode="cover"
                  />
                </View>
              )}
            />
            <View className="p-8 bg-base-200">
              <View>
                <Text className="text-secondary text-lg mb-4">
                  {product?.shopName}
                </Text>
                <Text className="text-secondary text-[24px] font-semibold mb-4">
                  {product?.name}
                </Text>
                <RenderHtml
                  contentWidth={width}
                  source={{ html: product?.description || "" }}
                  tagsStyles={{
                    body: { color: "#ff6600" }, // Orange text everywhere
                  }}
                />

                <Text className="text-center text-primary text-[24px]">
                  ₹ {product?.rate}
                </Text>

                <Pressable
                  hitSlop={10}
                  onPress={onShare}
                  className="absolute right-0 top-1/2 -translate-y-1/2"
                >
                  <Ionicons name="share-social" size={22} color="black" />
                </Pressable>
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
                  <Pressable onPress={() => dialPhone(product?.phone ?? "")}>
                    <Text className="text-[#fff] font-semibold text-xl text-center ">
                      Contact Now
                    </Text>
                  </Pressable>
                </View>
                <View className="w-[100%] bg-primary rounded-lg py-2 px-4">
                  <Pressable
                    disabled={isPending}
                    onPress={() => {
                      handleChat();
                      setShowModal(true);

                      console.log("Statrt chat");
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
                businessId={Number(product?.businessId)}
              />
            )}

            <View className="mx-4 p-4 rounded-lg bg-base-200 mb-10 flex-shrink">
              <Review rating={product?.rating} />
            </View>
          </View>
        </View>
      </ScrollView>
      <Modal
        visible={showModal}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
        transparent
      >
        <View
          className="flex-1 justify-center items-center bg-black/50"
          style={{
            backgroundColor:
              colorScheme === "dark" ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.5)",
          }}
        >
          <View
            className="w-[85%] p-5 rounded-2xl shadow-lg"
            style={{
              backgroundColor: Colors[colorScheme ?? "light"]["base-100"],
            }}
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-secondary w-[90%]">
                Write your message below and click Send. The shop owner will
                receive it instantly.
              </Text>
              <Pressable onPress={() => setShowModal(false)} className="mb-12">
                <Ionicons
                  name="close"
                  size={24}
                  color={Colors[colorScheme ?? "light"].secondary}
                />
              </Pressable>
            </View>

            <TextAreaInput
              className="bg-base-200 w-[100%] mx-auto"
              placeholder="Enter Your Message"
              onChangeText={(text) => setMessage(text)}
              value={message}
            />
            <PrimaryButton
              title="Send"
              onPress={() => {
                mutate({
                  message: message,
                  conversationId: conversation?.id,
                  image: product?.photos[0],
                  route: `business/singleProduct/${product?.id}`,
                });
                setMessage("");
              }}
              className="w-[40%] mt-4 self-end"
            />
          </View>
        </View>
      </Modal>
    </>
  );
}
