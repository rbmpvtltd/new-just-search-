import ChatTest from "@/features/test/chat";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";

export default async function page() {
  const { data: conversationList } = await asyncHandler(
    trpcServer.test.conversationList.query(),
  );

  console.log("conver", conversationList);

  return <ChatTest conversationList={conversationList} />;
}
