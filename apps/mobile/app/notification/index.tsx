import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { FlatList, Image, Text, useColorScheme, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import DataNotFound from "@/components/ui/DataNotFound";
import { NOTIFICATION_URL } from "@/constants/apis";
import Colors from "@/constants/Colors";
import { useClearNotification } from "@/query/clearNotifications";
import { useSuspenceData } from "@/query/getAllSuspense";
import { useStartChat } from "@/query/startChat";
import { useAuthStore } from "@/store/authStore";
import { Loading } from "@/components/ui/Loading";
import { useMaskAsRead } from "@/query/notification/notication";
import { isoStringToTime } from "@/utils/dateAndTime";

export default function Notification() {
  const colorScheme = useColorScheme();
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.authenticated);
  const { mutate: startChat, isPending: loading } = useStartChat();
  const { mutate: mutateMaskAsRead } = useMaskAsRead();
  if (loading) <Loading position="center" />;

  const { mutate: clearNotifications, isPending } = useClearNotification();

  const handleClear = () => {
    clearNotifications(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["notifications"],
        });
      },
      onError: (error) => {
        console.error("Clear failed:", error);
      },
    });
  };

  if (!isAuthenticated) {
    router.replace("/user/bottomNav/profile");
  }

  const { data } = useSuspenceData(NOTIFICATION_URL.url, NOTIFICATION_URL.key);
  if (data?.data?.length === 0) {
    return <DataNotFound />;
  }

  return (
    <>
      <FlatList
        className="bg-base-200 mb-10"
        data={data.data}
        renderItem={({ item, index }) => {
          return (
            <Pressable
              onPress={() => {
                mutateMaskAsRead(item.id, {
                  onSuccess: () => {
                    if (item.chat_session_id) {
                      startChat(item.chat_session_id, {
                        onSuccess: (res) => {
                          router.navigate({
                            pathname: "/chat/[chat]",
                            params: {
                              chat: res?.chat_session_id.toString(),
                            },
                          });
                        },
                        onError: (err) => {
                          console.error("Failed to start chat:", err);
                        },
                      });
                    }
                    queryClient.invalidateQueries({
                      queryKey: [NOTIFICATION_URL.key],
                    });
                    queryClient.invalidateQueries({
                      queryKey: ["getNotificationCount"],
                    });
                  },
                  onError: (err) => {
                    console.error("failed mask as read", err);
                  },
                });
              }}
            >
              <View
                className={`${index % 2 === 0 ? "bg-base-200" : "bg-base-100"} px-4 py-3 flex-row gap-6 items-center w-[100%]`}
              >
                <View className="relative">
                  <Image
                    source={require("@/assets/images/app-icon.png")}
                    className="w-[50px] h-[50px] rounded-full"
                  />
                  {item.is_read === 0 && (
                    <Ionicons
                      name="ellipse"
                      size={15}
                      color="#00a884"
                      className="absolute -left-1"
                    />
                  )}
                </View>
                <View className="w-[80%]">
                  <View className="flex-row justify-between items-center">
                    <Text className={`text-secondary text-2xl font-semibold`}>
                      {item?.name ? item.name : "Just Search"}
                    </Text>
                    <Text className="text-secondary">
                      {isoStringToTime(item.created_at)}
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-secondary text-[12px]">
                      {item.message}
                    </Text>
                    {item.is_read === 1 && (
                      <Ionicons
                        name="checkmark-done-circle-outline"
                        size={18}
                        color="#00a884"
                        className=""
                      />
                    )}
                    {item.isSended === 0 && (
                      <Ionicons
                        name="checkmark-done-circle-outline"
                        size={18}
                        color="#71889b"
                        className=""
                      />
                    )}
                  </View>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
      <SafeAreaView className="absolute bottom-[10px] right-[15px]">
        <View className="p-4 rounded-full bg-primary">
          <Pressable onPress={handleClear} disabled={isPending}>
            <Ionicons
              name="trash-outline"
              size={30}
              color={Colors[colorScheme ?? "light"].secondary}
              className=""
            />
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  );
}
