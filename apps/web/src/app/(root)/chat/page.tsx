import ConversationList from "@/features/chat/Chat";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";

export default async function page() {
  const { data: conversationList, error } = await asyncHandler(
    trpcServer.chat.conversationList.query(),
  );

  console.log("Error", error);

  return <ConversationList conversationList={conversationList} />;
}
