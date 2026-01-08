import { Ionicons } from "@expo/vector-icons";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import { AdvancedImage } from "cloudinary-react-native";
import { router, Stack } from "expo-router";
import { memo, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import { cld } from "@/lib/cloudinary";
import { type OutputTrpcType, trpc } from "@/lib/trpc";

type MessageListType =
  | OutputTrpcType["helpAndSupportRouter"]["messageList"]
  | null;
function HelpAndSupportPrivateChat({
  chatTokenSessionId,
}: {
  chatTokenSessionId: number;
}) {
  const { data: messageList } = useSuspenseQuery(
    trpc.helpAndSupportRouter.messageList.queryOptions({
      chatTokenSessionId: chatTokenSessionId,
    }),
  );

  const [store, setStore] = useState<Exclude<MessageListType, null>>(
    messageList ?? [],
  );

  useEffect(() => {
    setStore(messageList);
  }, [messageList]);

  const { data } = useSubscription(
    trpc.helpAndSupportRouter.onMessage.subscriptionOptions({
      chatTokenSessionId: chatTokenSessionId,
    }),
  );
  const { mutate: markRead } = useMutation(
    trpc.helpAndSupportRouter.markAsRead.mutationOptions(),
  );

  useEffect(() => {
    if (!data) return;
    setStore((prev) => [...prev, data]);
  }, [data]);

  useEffect(() => {
    const unread = store
      ?.filter((msg) => msg.sendByRole !== "User" && !msg.isRead)
      .map((msg) => msg.id);
    if (unread.length > 0) {
      markRead({ messageId: unread });
    }
  }, [store, markRead]);
  const colorScheme = useColorScheme();
  return (
    <>
      <Stack.Screen
        options={{
          title: "Admin",

          headerLeft: () => (
            <View className="flex-row items-center gap-2">
              <Pressable className="ml-2" onPress={() => router.back()}>
                <Ionicons
                  name="arrow-back"
                  size={24}
                  className="mr-2 self-center"
                />
              </Pressable>
              <View className="mr-2 w-10 h-10 rounded-full overflow-hidden border border-gray-300 items-center justify-center">
                <AdvancedImage
                  cldImg={cld.image("Banner/cbycmehjeetyxbuxc6ie")}
                  className="w-full h-full rounded-full object-cover"
                />
              </View>
            </View>
          ),
        }}
      />

      <View className="flex-1">
        <ScrollView>
          <View className="mt-3 space-y-3 px-2 max-h-full gap-2 overflow-y-scroll mb-2">
            {store.map((msg) => (
              <View
                key={msg.id}
                className={`max-w-[80%] px-2 py-2 rounded-2xl shadow-sm ${msg.sendByRole === "User" ? "bg-blue-100 self-end" : "bg-gray-200 self-start"}`}
              >
                <Text className="text-gray-800">{msg.message}</Text>
                <Text className="text-[10px] text-gray-500 mt-1 text-right">
                  {msg.updatedAt
                    ? new Date(msg.updatedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

function SendMessage({ chatTokenSessionId }: { chatTokenSessionId: number }) {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState("");
  const { mutate, isPending } = useMutation(
    trpc.helpAndSupportRouter.sendMessage.mutationOptions(),
  );
  return (
    <View
      className="flex-row p-[10px] bg-base-100 border-t border-gray-200"
      style={{ paddingBottom: insets.bottom - 40 }}
    >
      <TextInput
        className="bg-white flex-1 rounded-[20px] p-[12px] mr-[10px] text-[16px] text-gray-800 border border-gray-200"
        value={message}
        onChangeText={(newText) => setMessage(newText)}
        placeholder="Type your message..."
        placeholderTextColor="#999"
      />
      <Pressable
        className="bg-primary rounded-[20px] p-[12px] justify-center items-center"
        onPress={() => {
          if (message.length === 0) return;
          mutate({
            message: message,
            chatTokenSessionId: chatTokenSessionId,
          });
          setMessage("");
        }}
      >
        <Text className="text-white text-[16px] font-bold">
          {isPending ? "Sending" : "Send"}
        </Text>
      </Pressable>
    </View>
  );
}

const MemorizedPrivateChat = memo(HelpAndSupportPrivateChat);
const MemorizedSendMessage = memo(SendMessage);

export default function HelpAndSupportChat({
  chatTokenSessionId,
}: {
  chatTokenSessionId: number;
}) {
  return (
    <BoundaryWrapper>
      <View className="h-full">
        <MemorizedPrivateChat chatTokenSessionId={chatTokenSessionId} />
        <MemorizedSendMessage chatTokenSessionId={chatTokenSessionId} />
      </View>
    </BoundaryWrapper>
  );
}
