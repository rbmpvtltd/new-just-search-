// import { useSearchParams } from "next/navigation";
import ConversationList from "@/features/chat/ConversationList";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";

export default async function page() {
  const { data: conversationList, error } = await asyncHandler(
    trpcServer.chat.conversationList.query(),
  );

  return <ConversationList conversationList={conversationList} />;
}
