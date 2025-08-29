import { router } from "expo-router";
import { FlatList, Text, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import AvatarWithFallback from "@/components/ui/AvatarWithFallback";
import DataNotFound from "@/components/ui/DataNotFound";
import { maskPhone } from "@/utils/helper";
import { useOfferSession } from "@/query/chat/chatsession.query";

export default function OfferChats() {
  // NOTE: use this for clearNotifications:
  // const { mutate: clearNotifications, isPending } = useClearNotification();

  const { data: offerChats } = useOfferSession();

  // NOTE: may requested in future ---
  // const handleClear = () => {
  //   clearNotifications(undefined, {
  //     // First arg is for variables (none in this case)
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({
  //         queryKey: ["notifications"],
  //       });
  //     },
  //     onError: (error) => {
  //       console.error("Clear failed:", error);
  //     },
  //   });
  // };

  if (!offerChats?.length) {
    return <DataNotFound />;
  }

  return (
    <FlatList
      className="bg-base-200 "
      data={offerChats}
      renderItem={({ item, index }) => {
        return (
          <Pressable
            onPress={() => {
              router.push({
                pathname: "/chat/[chat]",
                params: { chat: item?.id.toString() },
              });
            }}
          >
            <View
              className={`${index % 2 === 0 ? "bg-base-200" : "bg-base-100"} px-4 py-3 flex-row gap-6 items-center w-[100%]`}
            >
              <View className="relative">
                <AvatarWithFallback
                  uri={`https://www.justsearch.net.in/assets/images/${item?.offer?.image1}`}
                  index={index}
                />

                {/* NOTE: This is dot indicate unread mask*/}
                {/* <Ionicons
                      name="ellipse"
                      size={15}
                      color="#00a884"
                      className="absolute -left-1"
                    /> */}
              </View>
              <View className="w-[100%]">
                <View className="justify-between w-[80%]">
                  <Text
                    className={`text-secondary text-2xl font-semibold w-[70%]`}
                  >
                    {item?.listing
                      ? item.listing?.name
                      : item?.user
                        ? item.user?.name
                          ? item.user.name
                          : item.user?.phone
                            ? maskPhone(item.user.phone)
                            : item.user?.email
                              ? item.user.email
                              : "user"
                        : "user"}
                  </Text>
                  <Text
                    className={`text-secondary text-sm font-semibold w-[70%]`}
                  >
                    {item?.offer
                      ? item?.offer?.product_name
                      : "Just Search Offer"}
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        );
      }}
    />
  );
}
