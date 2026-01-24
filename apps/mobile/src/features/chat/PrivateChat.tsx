import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import { AdvancedImage } from "cloudinary-react-native";
import { Stack } from "expo-router";
import { memo, useEffect, useRef, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import { cld } from "@/lib/cloudinary";
import { type OutputTrpcType, queryClient, trpc } from "@/lib/trpc";

type MessageListType = OutputTrpcType["chat"]["getMessageList"] | null;
type OtherUerDisplayNameAndImageType =
  | OutputTrpcType["chat"]["getOtherUserDisplayNameAndImage"]
  | null;
type UserDataType = OutputTrpcType["userRouter"]["getUserProfile"] | null;

const MemorizedPrivateChat = memo(
  ({
    userData,
    conversationId,
  }: {
    userData: UserDataType;
    conversationId: number;
    displayName: OtherUerDisplayNameAndImageType;
  }) => {
    const listRef = useRef<FlatList>(null);
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
      listRef.current?.scrollToEnd({ animated: true });
    }, [newMessage]);

    const { mutate: markRead } = useMutation(
      trpc.chat.markAsRead.mutationOptions(),
    );

    useEffect(() => {
      const unread = store
        .filter((m) => m.senderId !== userData?.profile?.id && !m.isRead)
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
      <View className="flex-1">
        <FlatList
          data={store}
          keyExtractor={(item) => String(item.id)}
          ref={listRef}
          contentContainerStyle={{
            paddingHorizontal: 8,
            paddingBottom: 12,
            paddingTop: 8,
          }}
          renderItem={({ item: msg }) => (
            <View className="px-2 mb-3">
              {msg.message && (
                <View
                  className={`max-w-[78%] px-4 py-2 rounded-2xl ${
                    msg.senderId === userData?.profile?.userId
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
                  className={`max-w-[70%] mt-1 ${
                    msg.senderId === userData?.profile?.userId
                      ? "self-end"
                      : "self-start"
                  }`}
                >
                  <AdvancedImage
                    cldImg={cld.image(msg.image)}
                    className="w-56 h-56 rounded-2xl shadow-sm border border-gray-200"
                  />
                </View>
              )}
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  },
);

const MemorizedSendMessage = memo(
  ({ conversationId }: { conversationId: number }) => {
    const [message, setMessage] = useState("");
    const { mutate, isPending } = useMutation(
      trpc.chat.sendMessage.mutationOptions(),
    );
    return (
      <View className="flex-row items-end  bg-white border-t border-gray-200 px-4 py-3 gap-3">
        <TextInput
          className="flex-1 bg-gray-100 text-gray-800 rounded-2xl px-4 py-4 text-sm"
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message…"
          placeholderTextColor="#9ca3af"
          multiline
        />

        <Pressable
          className={`h-12 w-12 rounded-full items-center justify-center mb-1 ${
            message.length === 0 ? "bg-gray-300" : "bg-primary"
          }`}
          onPress={() => {
            if (message.length === 0) return;
            mutate({ message, conversationId });
            setMessage("");
          }}
        >
          <Text className="text-white font-bold self-center">
            {isPending ? "…" : "➤"}
          </Text>
        </Pressable>
      </View>
    );
  },
);

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
          <KeyboardStickyView
            className="flex-1"
            offset={{
              opened: 50,
            }}
          >
            <MemorizedPrivateChat
              conversationId={conversationId}
              displayName={displayName}
              userData={userData}
            />

            <MemorizedSendMessage conversationId={conversationId} />
          </KeyboardStickyView>
        </View>
      </BoundaryWrapper>
    </>
  );
}
