import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import { AdvancedImage } from "cloudinary-react-native";
import { memo, useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
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

  return (
    <View className="flex-1">
      <View className="flex-row items-center gap-3 bg-gray-300 p-3 rounded-xl sticky top-0 left-0 right-0 z-10">
        <View className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 border border-gray-300 items-center justify-center">
          <AdvancedImage
            cldImg={cld.image("Banner/cbycmehjeetyxbuxc6ie")}
            className="w-full h-full rounded-full"
          />
        </View>
        <View>
          <Text className="font-semibold text-gray-900 text-lg">Admin</Text>
        </View>
      </View>
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
      style={{ paddingBottom: insets.bottom }}
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
      <View className="h-[79vh]">
        <MemorizedPrivateChat chatTokenSessionId={chatTokenSessionId} />
        <MemorizedSendMessage chatTokenSessionId={chatTokenSessionId} />
      </View>
    </BoundaryWrapper>
  );
}
