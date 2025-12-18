import { useSuspenseQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
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

  console.log("Conversation id", conversationId);

  return (
    <View>
      <StoreChat
        userData={userData}
        conversationId={Number(conversationId)}
        displayName={otherUserName}
      />
    </View>
  );
}

export default function Chat() {
  const { id } = useLocalSearchParams();
  const conversationId = Array.isArray(id) ? id[0] : id;
  return (
    <BoundaryWrapper>
      <Chats conversationId={Number(conversationId)} />
    </BoundaryWrapper>
  );
}
