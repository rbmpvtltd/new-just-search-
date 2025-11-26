"use client";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import type { OutputTrpcType } from "@/trpc/type";
import BoundaryWrapper from "@/utils/BoundaryWrapper";

type MessageListType = OutputTrpcType["chat"]["getMessageList"] | null;
type OtherUerDisplayNameAndImageType =
  | OutputTrpcType["chat"]["getOtherUserDisplayNameAndImage"]
  | null;
type UserDataType = OutputTrpcType["userRouter"]["getUserProfile"] | null;
function PrivateChat({
  userData,
  conversationId,
  // messageList,
  displayName,
}: {
  userData: UserDataType;
  conversationId: number;
  // messageList: MessageListType;
  displayName: OtherUerDisplayNameAndImageType;
}) {
  const trpc = useTRPC();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messageList } = useSuspenseQuery(
    trpc.chat.getMessageList.queryOptions({ conversationId }),
  );
  const [store, setStore] = useState<Exclude<MessageListType, null>>(
    messageList ?? [],
  );

  const lastMessageId = store?.length
    ? (store?.[store.length - 1]?.id ?? null)
    : null;
  // const lastMessageId =
  //   setStore ?
  //   setStore?.length > 0
  //     ? Number(setStore?[storeRef.current.length - 1].id)
  //     : setStore :  null;

  const { data: newMessage } = useSubscription(
    trpc.chat.onMessage.subscriptionOptions({
      conversationId,
      lastMessageId: Number(lastMessageId),
    }),
  );

  useEffect(() => {
    if (!newMessage) return;
    setStore((prev) => [...prev, newMessage]);
  }, [newMessage]);

  // Mark unread messages as read
  const { mutate: markRead } = useMutation(
    trpc.chat.markAsRead.mutationOptions(),
  );

  useEffect(() => {
    const unread = store
      .filter((m) => m.senderId !== userData?.id && !m.isRead)
      .map((m) => m.id);

    if (unread.length > 0) {
      markRead({ messageId: unread });
    }
  }, [markRead, userData, store]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messageList]);
  console.log("Outside UseEffect ");
  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto border border-gray-200 rounded-lg px-2 py-1 space-y-3 mb-3 bg-white relative"
    >
      <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg shadow-sm sticky top-0 left-0 right-0 ">
        <div className="border rounded-full overflow-hidden shadow ">
          {displayName?.[0]?.profileImage ? (
            <CldImage
              src={displayName?.[0]?.profileImage as string}
              width="40"
              height="40"
              alt="image"
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium text-lg ">
              {displayName?.[0]?.displayName?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <h2 className="font-semibold text-gray-800 text-lg">
          {displayName?.[0]?.displayName as string}
        </h2>
      </div>
      {store?.map((msg) => (
        <div key={msg.id} className="flex flex-col gap-1">
          {msg.message && (
            <div
              className={`flex px-2 py-2 rounded-xl text-sm shadow-sm w-fit ${
                msg.senderId === userData?.id
                  ? "bg-blue-100 ml-auto"
                  : "bg-gray-100"
              }`}
            >
              <h2 className="font-semibold">{msg.message}</h2>
              {/* <span className="block text-xs text-gray-500 mt-1 mx-1">
                {msg.updatedAt
                ? new Date(msg.updatedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      })
                      : ""}
              </span> */}
            </div>
          )}

          {msg.image && (
            <div
              className={`mt-1 max-w-[55%] ${
                msg.senderId === userData?.id ? "ml-auto" : ""
              }`}
            >
              <Link href={msg.route ? msg.route : "#"}>
                <CldImage
                  width="220"
                  height="220"
                  className="rounded-lg shadow border"
                  src={msg.image}
                  alt="Chat image"
                />
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function SendMessage({ conversationId }: { conversationId: number }) {
  const trpc = useTRPC();
  const [message, setMessage] = React.useState("");
  const { mutate, isPending } = useMutation(
    trpc.chat.sendMessage.mutationOptions(),
  );

  return (
    <div className="flex gap-2">
      <Input
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        type="text"
        placeholder="Type a message..."
        // className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
      />
      <Button
        onClick={() => {
          if (message.length === 0) return;
          mutate({
            message: message,
            conversationId: conversationId,
          });
          setMessage("");
        }}
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {isPending ? "Sending..." : "Send"}
      </Button>
    </div>
  );
}

const MemorizedPrivateChat = React.memo(PrivateChat);
const MemorizedSendMessage = React.memo(SendMessage);

export default function StoreChat({
  userData,
  conversationId,
  // messageList,
  displayName,
}: {
  displayName: OtherUerDisplayNameAndImageType;
  userData: UserDataType;
  conversationId: number;
  // messageList: MessageListType;
}) {
  // const scrollRef = useRef<HTMLDivElement>(null);
  // useEffect(() => {
  //   if (!scrollRef.current) return;
  //   scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  // }, [messageList]);
  return (
    <div className="p-4 max-w-md mx-auto flex flex-col h-[90vh]">
      {/* <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto border border-gray-200 rounded-lg px-2 py-1 space-y-3 mb-3 bg-white relative"
        > */}

      <BoundaryWrapper>
        <MemorizedPrivateChat
          conversationId={conversationId}
          userData={userData}
          displayName={displayName}
          // messageList={messageList}
        />
        {/* </div> */}
        <MemorizedSendMessage conversationId={conversationId} />
      </BoundaryWrapper>
    </div>
  );
}
