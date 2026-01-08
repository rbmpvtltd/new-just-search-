import { Ionicons } from "@expo/vector-icons";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import { AdvancedImage } from "cloudinary-react-native";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import { cld } from "@/lib/cloudinary";
import { type OutputTrpcType, queryClient, trpc } from "@/lib/trpc";

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
  const [store, setStore] = useState<Exclude<MessageListType, null>>(
    messageList ?? [],
  );

  const lastMessageId = store?.length
    ? (store?.[store.length - 1]?.id ?? null)
    : null;

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

  // useEffect(() => {
  //   setStore(messageList);
  // }, [messageList]);

  const { mutate: markRead } = useMutation(
    trpc.chat.markAsRead.mutationOptions(),
  );

  useEffect(() => {
    const unread = store
      .filter((m) => m.senderId !== userData?.id && !m.isRead)
      .map((m) => m.id);

    if (unread.length > 0) {
      markRead(
        { messageId: unread },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: trpc.chat.conversationList.queryKey(),
            });
          },
        },
      );
    }
  }, [markRead, userData, store]);

  return (
    <>
      {/* <Stack.Screen
        options={{
          headerShown: true,
          title: "Chat",
          headerTitle: () => (
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 border border-gray-300 items-center justify-center">
                {displayName?.[0]?.profileImage ? (
                  <AdvancedImage
                    cldImg={cld.image(displayName[0].profileImage)}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <Text className="text-blue-600 font-semibold text-lg">
                    {displayName?.[0]?.displayName?.charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>

              <Text className="font-semibold text-gray-900 text-lg">
                {displayName?.[0]?.displayName}
              </Text>
            </View>
          ),
        }}
      /> */}

      <View className="flex-1">
        <FlatList
          data={store}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{
            paddingHorizontal: 8,
            paddingBottom: 12,
            paddingTop: 8,
          }}
          renderItem={({ item: msg }) => (
            <View className="px-1 mb-2">
              {msg.message && (
                <View
                  className={`max-w-[80%] px-3 py-2 rounded-2xl shadow-sm ${
                    msg.senderId === userData?.userId
                      ? "bg-blue-100 self-end"
                      : "bg-gray-200 self-start"
                  }`}
                >
                  <Text className="text-gray-800">{msg.message}</Text>

                  <Text className="text-[10px] text-gray-500 mt-1 text-right">
                    {msg.updatedAt &&
                      new Date(msg.updatedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </Text>
                </View>
              )}

              {msg.image && (
                <View
                  className={`max-w-[65%] mt-1 ${
                    msg.senderId === userData?.userId
                      ? "self-end"
                      : "self-start"
                  }`}
                >
                  <AdvancedImage
                    cldImg={cld.image(msg.image)}
                    className="w-48 h-48 rounded-xl shadow border"
                  />
                </View>
              )}
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
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
      className="flex-row p-[10px] bg-base-100 border-t border-gray-200 "
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
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Chat",
          headerTitle: () => (
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 border border-gray-300 items-center justify-center">
                {displayName?.[0]?.profileImage ? (
                  <AdvancedImage
                    cldImg={cld.image(displayName[0].profileImage)}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <Text className="text-blue-600 font-semibold text-lg">
                    {displayName?.[0]?.displayName?.charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>

              <Text className="font-semibold text-gray-900 text-lg">
                {displayName?.[0]?.displayName}
              </Text>
            </View>
          ),
        }}
      />
      <BoundaryWrapper>
        <View className="flex-1">
          <MemorizedPrivateChat
            conversationId={conversationId}
            displayName={displayName}
            userData={userData}
          />

          <MemorizedSendMessage conversationId={conversationId} />
        </View>
      </BoundaryWrapper>
    </>
  );
}
