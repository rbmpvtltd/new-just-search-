import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
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
import RenderHTML from "react-native-render-html";
import LoginRedirect from "@/components/cards/LoginRedirect";
import Review from "@/components/forms/review";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import TextAreaInput from "@/components/inputs/TextAreaInput";
import Colors from "@/constants/Colors";
import { OfferReviewForm } from "@/features/offer/forms/create/OfferReviewForm";
import { trpc } from "@/lib/trpc";
import { dialPhone } from "@/utils/getContact";

const { width } = Dimensions.get("window");

export default function TabOneScreen() {
  const colorScheme = useColorScheme();

  const { singleOffer } = useLocalSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<any>(null);

  const router = useRouter();
  const singleOfferId = Array.isArray(singleOffer)
    ? singleOffer[0]
    : singleOffer;
  const { data: offer } = useQuery(
    trpc.businessrouter.singleOffer.queryOptions({
      offerId: Number(singleOfferId),
    }),
  );

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (offer?.businessId) {
          router.replace({
            pathname: "/(root)/(home)/subcategory/aboutBusiness/[premiumshops]",
            params: { premiumshops: String(offer.businessId) },
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
    }, [offer?.businessId, router]),
  );

  const { data: authenticated } = useQuery(trpc.auth.verifyauth.queryOptions());

  const { mutateAsync: createConversation } = useMutation(
    trpc.chat.createConversation.mutationOptions(),
  );

  async function handleChat() {
    const conv = await createConversation({
      receiverId: Number(offer?.userId),
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

  const onShare = async () => {
    try {
      const shareUrl = `https://web-test.justsearch.net.in/subcategory/aboutBusiness/offers/singleOffers/${offer?.id}`;

      const result = await Share.share(
        {
          title: offer?.name ?? "Check this Offer",
          message:
            Platform.OS === "android"
              ? `${offer?.name ?? "Amazing Offer"}\n\n${shareUrl}`
              : (offer?.name ?? "Amazing Offer"),
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
          title: offer?.name,
          headerLeft: () => (
            <Pressable
              className="ml-2"
              onPress={() => router.replace("/(root)/(offer)/allOffers")}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                className="p-2 mr-4 self-center"
              />
            </Pressable>
          ),
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
            data={offer?.photos ?? ["1"]}
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
                    -{offer?.discountPercent}%
                  </Text>
                </View>
              </View>
            )}
          />
          <View className="p-8 bg-base-200 ">
            <View className="mb-3">
              <View className="flex-row items-center justify-between">
                <Text
                  className="text-secondary text-lg flex-1 pr-3"
                  numberOfLines={2}
                >
                  {offer?.shopName}
                </Text>
                <Pressable hitSlop={10} onPress={onShare}>
                  <Ionicons name="share-social" size={22} color="black" />
                </Pressable>
              </View>
              <Text className="text-secondary text-[24px] font-semibold mt-2 mb-2">
                {offer?.name}
              </Text>
              <RenderHTML
                contentWidth={width}
                source={{ html: offer?.description || "" }}
                tagsStyles={{
                  body: { color: "#ff6600" },
                }}
              />
              <View className="flex-row items-center gap-4 mt-2">
                <Text className="text-primary text-lg font-semibold">
                  ₹{offer?.finalPrice}
                </Text>
                <Text className="text-secondary line-through">
                  ₹{offer?.rate}
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
                      params: { premiumshops: String(offer?.businessId) },
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
                    disabled={isPending}
                    onPress={() => {
                      handleChat();
                      setShowModal(true);
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
                  <Pressable onPress={() => dialPhone(offer?.phoneNo ?? "")}>
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
              <Review rating={offer?.rating} />
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
                  image: offer?.photos[0],
                  route: `business/singleProduct/${offer?.id}`,
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
