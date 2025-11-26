import HelpAndSupportChat from "@/features/help-and-support/chat/HelpAndSupportPrivateChat";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";
export default async function Page({
  params,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;

  const { data: messageList, error } = await asyncHandler(
    trpcServer.helpAndSupportRouter.messageList.query({
      chatTokenSessionId: Number(id),
    }),
  );

  console.log("Message list", messageList);

  return (
    <HelpAndSupportChat
      chatTokenSessionId={Number(id)}
      messageList={messageList}
    />
  );
}
