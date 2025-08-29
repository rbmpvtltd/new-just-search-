import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { FlatList, Image, Text, View } from "react-native";
import {
  GestureHandlerRootView,
  Pressable,
} from "react-native-gesture-handler";
import { LISTING_PRODUCT_LIST_URL } from "@/constants/apis";
import { useSuspenceData } from "@/query/getAllSuspense";
import { useStartProductChat } from "@/query/startProductChat";
import { useAuthStore } from "@/store/authStore";
import { showLoginAlert } from "@/utils/alert";
import DataNotFound from "./DataNotFound";

function ListingProduct({ shopId }: { shopId: string }) {
  const { data } = useSuspenceData(
    LISTING_PRODUCT_LIST_URL.url,
    LISTING_PRODUCT_LIST_URL.key,
    shopId,
  );
  const isAuthenticated = useAuthStore((state) => state.authenticated);
  const { mutate: startChat } = useStartProductChat();
  const clearToken = useAuthStore((state) => state.clearToken);
  if (data?.product?.length === 0) {
    return <DataNotFound />;
  }
  return (
    <FlatList
      keyExtractor={(_, i) => i.toString()}
      data={data.product}
      renderItem={(item: any) => {
        return (
          <GestureHandlerRootView>
            <View className="bg-base-200 rounded-lg w-[90%] shadow-lg  m-4">
              <Pressable
                onPress={() => {
                  router.push({
                    pathname: "/singleProduct/[singleProduct]",
                    params: { singleProduct: item?.item?.id },
                  });
                }}
              >
                {/* Image Section */}
                <View className="relative">
                  <View className="relative h-auto mx-auto mt-2 w-[60%] ">
                    <Image
                      className="w-full rounded-lg aspect-[3/4] "
                      source={{
                        uri: `https://www.justsearch.net.in/assets/images/${item?.item?.image1}`,
                      }}
                    />
                  </View>
                </View>
                <View>
                  <Text className="text-secondary-content my-4 mx-3 text-xl text-center">
                    {item?.item?.product_name}
                  </Text>
                  <Text className="text-primary font-semibold text-[24px] my-4 mx-3 text-xl text-center">
                    ₹{item?.item?.rate}
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
                          router.replace("/user/bottomNav/profile");
                        },
                      });
                    } else {
                      startChat(
                        {
                          listingId: item?.item?.listing_id,
                          productId: item?.item?.id,
                        },
                        {
                          onSuccess: (res) => {
                            router.push({
                              pathname: "/chat/[chat]",
                              params: { chat: res?.chat_session_id.toString() },
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
          </GestureHandlerRootView>
        );
      }}
    />
  );
}

export default ListingProduct;
