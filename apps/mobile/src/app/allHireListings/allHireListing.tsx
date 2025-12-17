import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Text,
  useColorScheme,
  View,
} from "react-native";
import DataNotFound from "@/components/ui/DataNotFound";
import { Loading } from "@/components/ui/Loading";
import Colors from "@/constants/Colors";
import { useAuthStore } from "@/features/auth/authStore";
import { useHireSearchLists } from "@/query/hireSearchListings";
import { useOfferSearchLists } from "@/query/offerSearchListing";
import { useStartChat } from "@/query/startChat";
import { useStartOfferChat } from "@/query/startOfferChat";
import { showLoginAlert } from "@/utils/alert";
import { dialPhone } from "@/utils/getContact";

// import { openInGoogleMaps } from "@/utils/getDirection";

const { width } = Dimensions.get("window");
const imageHeight = width * 0.8;

export default function AllHireListing() {
  const { location, category } = useLocalSearchParams();
  const isAuthenticated = useAuthStore((state) => state.authenticated);
  const { mutate: startChat } = useStartChat();
  const clearToken = useAuthStore((state) => state.clearToken);
  const colorScheme = useColorScheme();

  // const setShopId = useShopIdStore((state) => state.setShopId);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useHireSearchLists(location.toString(), category.toString());

  if (isLoading) {
    return <Loading position="center" />;
  }

  if (isError) {
    console.log("Error in hire search:", error);
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-error">
          Error loading hires: {error?.message || "Unknown error"}
        </Text>
      </View>
    );
  }

  // Flatten all pages data for FlatList
  const allData = data?.pages?.flatMap((page) => page.data) ?? [];

  if (allData.length === 0) {
    return <DataNotFound />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "All Searched Hires",
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
          return (
            <View className="w-[90%] m-auto mb-4 rounded-xl bg-base-200 pb-4 shadow-2xl mt-2">
              {/* <View className="h-[280px] mx-auto mt-2 w-[60%] "> */}
              <Pressable
                onPress={() => router.navigate(`/hireDetail/${item?.slug}`)}
              >
                <View
                  className="mt-2 "
                  style={{
                    width: width * 0.9,
                    height: imageHeight,
                  }}
                >
                  <Image
                    source={{
                      uri: `https://www.justsearch.net.in/assets/images/${item?.photo}`,
                    }}
                    className="w-full h-full rounded-xl"
                    resizeMode="contain"
                  />
                </View>
              </Pressable>

              <View className="flex-row items-center justify-between w-full">
                <Text className="m-4 w-[80%] text-2xl font-semibold text-secondary ">
                  {item?.name}
                </Text>
                {Number(item?.user?.verify) === 1 && (
                  <Ionicons
                    name="checkmark-circle"
                    size={28}
                    color="green"
                    className="mr-4"
                  />
                )}
              </View>
              <View className="flex-row gap-2 m-4 flex-wrap">
                <Pressable
                  className="rounded-md px-4 py-2 max-w-[50%]"
                  style={{
                    backgroundColor:
                      Colors[colorScheme ?? "light"]["success-contect"],
                  }}
                >
                  <Text className="text-success font-semibold text-xs w-[100%]">
                    {item?.categories[0]?.title}
                  </Text>
                </Pressable>

                {item?.subcategories?.map((sub: any, i: number) => (
                  <Pressable
                    key={i.toString()}
                    className="rounded-md px-4 py-2"
                    style={{
                      backgroundColor:
                        Colors[colorScheme ?? "light"]["error-content"],
                    }}
                  >
                    <Text className="text-error font-semibold text-xs w-[100%]">
                      {sub.name}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View className="mx-4 my-2">
                <Text className="text-secondary-content">{item.job_role}</Text>
              </View>
              <View className="mx-4 my-2">
                <Text className="text-secondary-content">{item.job_type}</Text>
              </View>
              <View className="mx-4 my-2">
                <Text className="text-secondary-content">
                  <Ionicons name="location" />
                  {item?.real_address}
                </Text>
              </View>
              <Pressable
                onPress={() => {
                  if (!isAuthenticated) {
                    showLoginAlert({
                      message: "Need to login to chat on your behalf",
                      onConfirm: () => {
                        clearToken();
                        router.push("/(root)/profile");
                      },
                    });
                  } else {
                    startChat(item?.id, {
                      onSuccess: (res) => {
                        console.log("Chat started:", res?.chat_session_id);

                        router.push({
                          pathname: "/chat/[chat]",
                          params: { chat: res?.chat_session_id.toString() },
                        });
                      },
                      onError: (err) => {
                        console.error("Failed to start chat:", err);
                      },
                    });
                  }
                }}
                style={{
                  width: "90%",
                  backgroundColor: Colors[colorScheme ?? "light"].primary,
                  padding: 8,
                  borderRadius: 4,
                  marginTop: 8,
                  marginHorizontal: "auto",
                }}
              >
                <View className="text-xl text-center flex-row py-1 gap-2 justify-center items-start">
                  <Ionicons name="chatbox-ellipses" size={20} color={"white"} />
                  <Text className="text-[#ffffff] text-center font-semibold">
                    Chat Now
                  </Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => dialPhone(item?.phone_number)}
                style={{
                  width: "90%",
                  backgroundColor: Colors[colorScheme ?? "light"].primary,
                  padding: 8,
                  borderRadius: 4,
                  marginTop: 8,
                  marginHorizontal: "auto",
                }}
              >
                <View className="text-xl text-center flex-row py-1 gap-2 justify-center items-start">
                  <Ionicons name="call" size={20} color={"white"} />
                  <Text className="text-[#ffffff] text-center font-semibold">
                    Contact Now
                  </Text>
                </View>
              </Pressable>
            </View>
          );
          // return <SearchListCard item={item} />;
        }}
        onEndReached={() => {
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
