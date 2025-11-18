import StoreChat from "@/features/chat/PrivateChat";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";
export default async function Page({
  params,
}: {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  // const { data: } = await asyncHandler(trpcServer.chat.conversationList.query({conversationId: Number(id)}))

  // const { data: conversation } = await asyncHandler(
  //   trpcServer.chat.createConversation.query({ userId: Number(id) }),
  // );

  // console.log("conversation", conversation);

  // return
  const { data: messageList, error } = await asyncHandler(
    trpcServer.chat.getMessageList.query({ conversationId: Number(id) }),
  );

  const { data: userData } = await asyncHandler(
    trpcServer.userRouter.getUserProfile.query(),
  );

  return (
    <StoreChat
      conversationId={Number(id)}
      messageList={messageList}
      userData={userData}
    />
  );
}
