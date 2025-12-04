import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import AvatarWithFallback from "@/components/ui/AvatarWithFallback";
import { Loading } from "@/components/ui/Loading";
import { SomethingWrong } from "@/components/ui/SomethingWrong";
import { useChatMessages } from "@/query/chatMessages";
import { maskPhone } from "@/utils/helper";

export default function () {
  const { chat } = useLocalSearchParams();
  const chatSessionId = Array.isArray(chat) ? chat[0] : chat;
  const { data, isLoading, isError } = useChatMessages(chatSessionId);
  if (isLoading) {
    return <Loading position="center" />;
  }
  if (isError) {
    return <SomethingWrong />;
  }

  const heading = data?.chat_session
    ? data.chat_session?.listing
      ? data.chat_session.listing?.name
      : data.chat_session?.user
        ? data.chat_session.user?.name
          ? data.chat_session.user.name
          : data.chat_session.user?.phone
            ? maskPhone(data.chat_session.user.phone)
            : data.chat_session.user?.email
              ? data.chat_session.user.email
              : "user"
        : "user"
    : "Just Search";
  const imageUri = data?.chat_session?.listing?.photo;
  return (
    <Stack>
      <Stack.Screen
        name="[chat]"
        options={{
          headerShown: true,

          headerTitle: () => (
            <View className="flex-row items-center gap-4  px-4 py-2 rounded-lg sticky">
              <AvatarWithFallback
                uri={`https://www.justsearch.net.in/assets/images/${imageUri}`}
                imageClass="w-[40px] h-[40px]"
                iconSize={20}
              />
              <Text className="text-secondary font-semibold text-xl">
                {heading
                  ? heading.length > 20
                    ? `${heading.slice(0, 20)}...`
                    : heading
                  : "Loading..."}
              </Text>
            </View>
          ),
        }}
      />
    </Stack>
  );
}
