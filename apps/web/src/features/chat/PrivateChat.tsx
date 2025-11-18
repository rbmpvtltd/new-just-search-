"use client";
import { useMutation } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import React, { useEffect } from "react";
import { useTRPC } from "@/trpc/client";
import type { OutputTrpcType } from "@/trpc/type";
import { useChatStore } from "./useStore";

type MessageListType = OutputTrpcType["chat"]["getMessageList"] | null;
function PrivateChat({
  userData,
  conversationId,
}: {
  userData: any;
  conversationId: number;
}) {
  const trpc = useTRPC();
  const zustandStoreMessages = useChatStore(
    (state) => state.zustandStoreMessages,
  );
  const liveMessages = useChatStore((state) => state.liveMessages);
  const allMessages = [...zustandStoreMessages, ...liveMessages];
  const setLiveMessage = useChatStore((state) => state.setLiveMessage);
  const { data, error } = useSubscription(
    trpc.chat.onMessage.subscriptionOptions({
      conversationId: conversationId,
      // messageId: String(allMessages[allMessages.length -1]?.id),
    }),
  );

  if (error) {
    console.log("error", error);
  }

  useEffect(() => {
    if (data) {
      setLiveMessage(data);
    }
  }, [data, setLiveMessage]);

  return (
    <div className="flex-1 overflow-y-auto border border-gray-200 rounded p-3 space-y-2 mb-3">
      {allMessages?.map((msg) => (
        <div
          key={msg.id}
          className={`p-2 rounded text-sm max-w-[80%] ${
            msg.senderId === userData.id
              ? "bg-blue-100 self-end ml-auto"
              : "bg-gray-100 "
          }`}
        >
          {msg.message}
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
      <input
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        type="text"
        placeholder="Type a message..."
        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
      />
      <button
        onClick={() => {
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
      </button>
    </div>
  );
}

const MemorizedPrivateChat = React.memo(PrivateChat);
const MemorizedSendMessage = React.memo(SendMessage);

export default function StoreChat({
  userData,
  conversationId,
  messageList,
}: {
  userData: any;
  conversationId: number;
  messageList: MessageListType;
}) {
  const setzustandStoreMessages = useChatStore(
    (state) => state.setzustandStoreMessages,
  );

  useEffect(() => {
    if (messageList?.length) {
      setzustandStoreMessages(messageList);
    }
  }, [messageList, setzustandStoreMessages]);

  return (
    <div className="p-4 max-w-md mx-auto flex flex-col h-[90vh]">
      <MemorizedPrivateChat
        conversationId={conversationId}
        userData={userData}
      />
      <MemorizedSendMessage conversationId={conversationId} />
    </div>
  );
}
