import { router } from "expo-router";
import { FlatList, Text, View,Pressable } from "react-native";
import AvatarWithFallback from "@/components/ui/AvatarWithFallback";
import { useChatSession } from "@/query/chat/chatsession.query";

export default function Index() {
  const { data: Chats } = useChatSession();

  // NOTE: this is for clear chat botton
  // const { mutate: clearNotifications, isPending } = useClearNotification();
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

  if (Chats?.length === 0) {
    return (
      <View className="flex flex-1 px-8 py-4 bg-base-100 justify-center items-center">
        <Text className="text-secondary text-2xl">No Chats Found</Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        className="bg-base-200"
        data={Chats}
        renderItem={({ item, index }) => {
          return (
            <Pressable
              onPress={() => {
                router.push({
                  pathname: "/chat/[chat]",
                  params: { chat: item?.id?.toString() },
                });
              }}
            >
              <View
                className={`${index % 2 === 0 ? "bg-base-200" : "bg-base-100"} px-4 py-3 flex-row gap-6 items-center w-[100%]`}
              >
                <View className="relative">
                  <AvatarWithFallback
                    uri={`https://www.justsearch.net.in/assets/images/${item?.listing?.photo}`}
                    index={index}
                  />

                  {/* <Ionicons
                    name="ellipse"
                    size={15}
                    color="#00a884"
                    className="absolute -left-1"
                  /> */}
                </View>
                <View className="w-[80%]">
                  <View className="flex-row justify-between items-start">
                    <Text
                      className={`text-secondary text-2xl w-[70%] font-semibold`}
                    >
                      {item?.listing
                        ? item?.listing?.name
                        : item?.user
                          ? item.user?.name
                            ? item.user.name
                            : "User"
                          : `User`}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
      {/* <SafeAreaView className="absolute bottom-[1px] right-[15px]">
        <View className="p-4 rounded-full bg-primary">
          <Pressable
            className="p-4 rounded-full bg-primary"
            onPress={handleClear}
            disabled={isPending}
          >
            <Ionicons
              name="trash-outline"
              size={30}
              color={Colors[colorScheme ?? "light"].secondary}
              className=""
            />
          </Pressable>
        </View>
      </SafeAreaView> */}
    </>
  );
}
