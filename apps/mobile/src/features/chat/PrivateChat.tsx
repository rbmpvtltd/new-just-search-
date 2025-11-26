import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import { AdvancedImage } from "cloudinary-react-native";
import React, { useEffect, useState } from "react";
import {
  BackHandler,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import { cld } from "@/lib/cloudinary";
import { type OutputTrpcType, trpc } from "@/lib/trpc";

type MessageListType = OutputTrpcType["chat"]["getMessageList"] | null;
type OtherUerDisplayNameAndImageType =
  | OutputTrpcType["chat"]["getOtherUserDisplayNameAndImage"]
  | null;
type UserDataType = OutputTrpcType["userRouter"]["getUserProfile"] | null;

function PrivateChat({
  userData,
  conversationId,
  displayName,
}: {
  userData: UserDataType;
  conversationId: number;
  displayName: OtherUerDisplayNameAndImageType;
}) {
  const { data: messageList } = useSuspenseQuery(
    trpc.chat.getMessageList.queryOptions({ conversationId }),
  );

  const [store, setStore] = useState(messageList);

  //Store ko server update ke saath sync
  useEffect(() => {
    setStore(messageList);
  }, [messageList]);

  const lastMessageId = store?.length
    ? (store?.[store.length - 1]?.id ?? null)
    : null;
  const { mutate: markRead } = useMutation(
    trpc.chat.markAsRead.mutationOptions(),
  );

  const { data: newMessage, error } = useSubscription(
    trpc.chat.onMessage.subscriptionOptions({
      conversationId: conversationId,
      lastMessageId: Number(lastMessageId),
    }),
  );

  useEffect(() => {
    if (!newMessage) return;
    setStore((prev) => [...prev, newMessage]);
  }, [newMessage]);

  useEffect(() => {
    const unread = store
      .filter((m) => m.senderId !== userData?.id && !m.isRead)
      .map((m) => m.id);

    if (unread.length > 0) {
      markRead({ messageId: unread });
    }
  }, [markRead, userData, store]);

  console.log("Store", store);

  return (
    <View className="flex-1">
      {/* HEADER */}
      <View className="flex-row items-center gap-3 bg-gray-300 p-3 rounded-xl">
        <View className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 border">
          {displayName?.[0]?.profileImage ? (
            <AdvancedImage
              cldImg={cld.image(displayName?.[0].profileImage)}
              className="w-full h-full"
            />
          ) : (
            <Text className="text-blue-600 text-lg font-bold">
              {displayName?.[0]?.displayName?.[0]}
            </Text>
          )}
        </View>

        <Text className="font-semibold text-gray-900 text-lg">
          {displayName?.[0]?.displayName}
        </Text>
      </View>

      {/* MESSAGE LIST */}
      <ScrollView>
        <View className="mt-3 space-y-3 px-2 mb-2">
          {store.map((msg) => (
            <View key={msg.id} className="px-1">
              {msg.message && (
                <View
                  className={`max-w-[80%] px-2 py-2 rounded-2xl shadow-sm ${
                    msg.senderId === userData?.id
                      ? "bg-blue-100 self-end"
                      : "bg-gray-200 self-start"
                  }`}
                >
                  <Text>{msg.message}</Text>
                  <Text className="text-[10px] text-gray-500 mt-1 text-right">
                    {new Date(msg.updatedAt!).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              )}

              {msg.image && (
                <AdvancedImage
                  cldImg={cld.image(msg.image)}
                  className={`w-48 h-48 rounded-xl shadow border ${
                    msg.senderId === userData?.id ? "self-end" : "self-start"
                  }`}
                />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function SendMessage({ conversationId }: { conversationId: number }) {
  const [message, setMessage] = useState("");
  const { mutate, isPending } = useMutation(
    trpc.chat.sendMessage.mutationOptions(),
  );
  const insets = useSafeAreaInsets();
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
            conversationId: conversationId,
          });
          setMessage("");
        }}
      >
        <Text className="text-white text-[16px] font-bold">
          {isPending ? "Sending..." : "Send"}
        </Text>
      </Pressable>
    </View>
  );
}
const MemorizedPrivateChat = React.memo(PrivateChat);
const MemorizedSendMessage = React.memo(SendMessage);
export default function StoreChat({
  userData,
  conversationId,
  displayName,
}: {
  userData: UserDataType;
  conversationId: number;
  displayName: OtherUerDisplayNameAndImageType;
}) {
  return (
    <BoundaryWrapper>
      <View className="h-[79vh]">
        <MemorizedPrivateChat
          conversationId={conversationId}
          displayName={displayName}
          userData={userData}
        />

        <MemorizedSendMessage conversationId={conversationId} />
      </View>
    </BoundaryWrapper>
  );
}
