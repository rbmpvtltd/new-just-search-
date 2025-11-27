import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Alert, FlatList, Image, Pressable, Text, View } from "react-native";
import DataNotFound from "@/components/ui/DataNotFound";
import { Loading } from "@/components/ui/Loading";
import { apiUrl } from "@/constants/Variable";
import { useOfferSearchLists } from "@/query/offerSearchListing";
import { useStartOfferChat } from "@/query/startOfferChat";
import { useStartProductChat } from "@/query/startProductChat";
import { useAuthStore } from "@/store/authStore";
import { useShopIdStore } from "@/store/shopIdStore";
import { showLoginAlert } from "@/utils/alert";
import { openInGoogleMaps } from "@/utils/getDirection";

export default function AllOfferListing() {
  const { location, category } = useLocalSearchParams();
  const isAuthenticated = useAuthStore((state) => state.authenticated);
  const clearToken = useAuthStore((state) => state.clearToken);
  const { mutate: startOfferChat, isPending } = useStartOfferChat();

  const setShopId = useShopIdStore((state) => state.setShopId);
  const { mutate: startChat } = useStartProductChat();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useOfferSearchLists(location.toString(), category.toString());

  if (isLoading) {
    return <Loading position="center" />;
  }

  if (isError) {
    console.log("Error in offer search:", error);
    return (
      <View className="flex flex-1 px-8 py-4 bg-base-100 justify-center items-center">
        <Text className="text-secondary text-center text-2xl">
          No Offers Found For {category} in {location}
        </Text>
      </View>
    );
  }

  // Flatten all pages data for FlatList
  const allData = data?.pages.flatMap((page) => page?.data || []) || [];
  if (allData.length === 0) {
    return <DataNotFound />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "All Searched Offers",
        }}
      />
      <FlatList
        nestedScrollEnabled={true}
        data={allData}
        contentContainerStyle={{ minHeight: "100%" }}
        keyExtractor={(item) =>
          item?.o_id?.toString() ??
          item?.id?.toString() ??
          Math.random().toString()
        }
        renderItem={({ item }) => {
          if (!item) return null;
          if (item?.type === "offer") {
            const latitude = Number(item?.latitude?.split(",").shift());
            const longitude = Number(item?.longitude?.split(",").pop());
            return (
              <View className="bg-base-200 rounded-lg w-[90%] shadow-lg m-4">
                {/* Image Section */}
                <View className="relative">
                  <View className="relative h-auto mx-auto mt-2 w-[60%] ">
                    <Pressable
                      onPress={() => {
                        router.push({
                          pathname: "/(root)/(home)/subcategory/aboutBusiness/offers/singleOffers/[singleOffer]",
                          params: { singleOffer: item?.product_id },
                        });
                      }}
                    >
                      <Image
                        className="w-full rounded-lg aspect-[3/4]"
                        source={{
                          uri: `${apiUrl}/assets/images/${item?.image1}`,
                        }}
                      />
                      <Text className="absolute bg-error text-secondary mt-8 pl-8 pr-3 rounded-r-md t-10">
                        -{item?.discount_percent}%
                      </Text>
                    </Pressable>
                  </View>
                </View>
                <View className="h-auto w-full mt-4 px-4">
                  <Text className="text-secondary text-2xl font-semibold">
                    {item?.name}
                  </Text>
                </View>
                <View className="h-auto w-full mt-4 px-4">
                  <Text className="text-secondary text-lg ">
                    {item?.listing_name}
                  </Text>
                </View>
                <View className="h-auto w-full mt-4 px-4 ">
                  <Text className="text-primary text-lg ">
                    ₹{item?.final_price}{" "}
                    <Text className="text-secondary line-through ">
                      ₹{item?.rate}
                    </Text>
                  </Text>
                </View>

                <View className="w-full items-center gap-4 my-4">
                  <View className="w-[90%] bg-primary rounded-lg py-2 px-4">
                    <Pressable
                      onPress={() => openInGoogleMaps(String(latitude), String(longitude))}
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
                        if (!isAuthenticated) {
                          showLoginAlert({
                            message: "Need to login to chat on your behalf",
                            onConfirm: () => {
                              clearToken();
                              router.replace("/(root)/profile");
                            },
                          });
                        } else {
                          startOfferChat(
                            {
                              listingId: item?.o_listing_id,
                              offerId: item?.o_id,
                            },
                            {
                              onSuccess: (res) => {
                                router.push({
                                  pathname: "/chat/[chat]",
                                  params: {
                                    chat: res?.chat_session_id.toString(),
                                  },
                                });
                              },
                              onError: (err) => {
                                console.error("Failed to start chat:", err);
                              },
                            },
                          );
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
            );
          } else {
            return (
              <View className="bg-base-200 rounded-lg w-[90%] shadow-lg  m-4">
                <Pressable
                  onPress={() => {
                    router.push({
                      pathname: "/(root)/(home)/subcategory/aboutBusiness/products/singleProduct/[singleProduct]",
                      params: { singleProduct: item?.product_id },
                    });
                  }}
                >
                  {/* Image Section */}
                  <View className="relative">
                    <View className="relative h-auto mx-auto mt-2 w-[60%] ">
                      <Image
                        className="w-full rounded-lg aspect-[3/4] "
                        source={{
                          uri: `https://www.justsearch.net.in/assets/images/${item?.image1}`,
                        }}
                      />
                    </View>
                  </View>
                  <View>
                    <Text className="text-secondary-content mx-3 text-xl text-center">
                      {item?.name}
                    </Text>
                    <Text className="text-primary font-semibold text-[24px] my-1 mx-3 text-xl text-center">
                      ₹{item?.rate}
                    </Text>
                  </View>
                </Pressable>
                <View className="w-[80%] bg-primary p-2 rounded mt-2 mx-auto mb-4">
                  <Pressable
                    onPress={() => {
                      if (!isAuthenticated) {
                        showLoginAlert({
                          message: "Need to login to chat on your behalf",
                          onConfirm: () => {
                            clearToken();
                            router.replace("/(root)/profile");
                          },
                        });
                      } else {
                        startChat(
                          {
                            listingId: item?.listing_id,
                            productId: item?.product_id,
                          },
                          {
                            onSuccess: (res) => {
                              router.push({
                                pathname: "/chat/[chat]",
                                params: {
                                  chat: res?.chat_session_id.toString(),
                                },
                              });
                            },
                            onError: (err) => {
                              console.error("Failed to start chat:", err);
                            },
                          },
                        );
                      }
                    }}
                  >
                    <View className="flex-row justify-center items-center">
                      <Ionicons
                        name="chatbox-ellipses"
                        size={20}
                        color="white"
                        className="mr-2"
                      />
                      <Text className="text-[#ffffff] font-semibold text-center">
                        Chat Now
                      </Text>
                    </View>
                  </Pressable>
                </View>
              </View>
            );
          }
        }}
        onEndReached={() => {
          console.log("onEndReached triggered", {
            hasNextPage,
            isFetchingNextPage,
          });
          if (hasNextPage && !isFetchingNextPage) {
            console.log("Fetching next page");
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() => (isFetchingNextPage ? <Loading /> : null)}
      />
    </>
  );
}
