import { useSuspenseQuery } from "@tanstack/react-query";
import { AdvancedImage } from "cloudinary-react-native";
import { useRouter } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import { cld } from "@/lib/cloudinary";
import { type OutputTrpcType, trpc } from "@/lib/trpc";

type ConversationListType = OutputTrpcType["chat"]["conversationList"] | null;
export default function ConversationList() {
  const router = useRouter();
  const { data: conversationList } = useSuspenseQuery(
    trpc.chat.conversationList.queryOptions(),
  );

  if (!conversationList || conversationList.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500 text-base">No conversations found.</Text>
      </View>
    );
  }
  return (
    <FlatList
      className="bg-base-100"
      data={conversationList}
      renderItem={({ item, index }) => {
        return (
          <Pressable
            className=""
            onPress={() =>
              router.navigate({
                pathname: "/(root)/(home)/chat/[id]",
                params: { id: item?.id },
              })
            }
          >
            <View
              className={`flex-row items-center w-full p-4 ${
                index % 2 === 0 ? "bg-gray-100" : "bg-white"
              } `}
            >
              <View className="w-12 h-12 rounded-full bg-blue-100 overflow-hidden mr-4 items-center justify-center">
                {item.profileImage ? (
                  <AdvancedImage
                    cldImg={cld.image(item?.profileImage)}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <Text className="text-blue-600 font-semibold text-lg">
                    {String(item?.displayName).charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>

              <View className="flex-1">
                <Text className="font-semibold text-base text-gray-800">
                  {item.displayName}
                </Text>

                <Text
                  className="text-gray-500 text-sm mt-0.5"
                  numberOfLines={1}
                >
                  {item.lastMessage || "No message yet"}
                </Text>
              </View>

              <View className="items-end ml-2">
                <Text className="text-xs text-gray-500 mb-1">
                  {item.updatedAt
                    ? new Date(item.updatedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </Text>

                {item.unreadCount > 0 && (
                  <View className="min-w-[22px] h-[22px] bg-blue-500 rounded-full items-center justify-center">
                    <Text className="text-white text-xs font-semibold">
                      {item.unreadCount}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </Pressable>
        );
      }}
    />
  );
}
