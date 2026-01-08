import { useSuspenseQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import StoreChat from "@/features/chat/PrivateChat";
import { trpc } from "@/lib/trpc";

function Chats({ conversationId }: { conversationId: number }) {
  const { data: userData } = useSuspenseQuery(
    trpc.userRouter.getUserProfile.queryOptions(),
  );

  const { data: otherUserName } = useSuspenseQuery(
    trpc.chat.getOtherUserDisplayNameAndImage.queryOptions({
      conversationId: Number(conversationId),
    }),
  );

  return (
    <StoreChat
      userData={userData}
      conversationId={Number(conversationId)}
      displayName={otherUserName}
    />
  );
}

export default function Chat() {
  const { id } = useLocalSearchParams();
  const conversationId = Array.isArray(id) ? id[0] : id;
  return (
    // <SafeAreaView className="flex-1">
    <>
      {/* <Stack.Screen options={{ headerShown: true, title: "Chat" }} /> */}
      <BoundaryWrapper>
        <Chats conversationId={Number(conversationId)} />
      </BoundaryWrapper>
    </>
    // </SafeAreaView>
  );
}
