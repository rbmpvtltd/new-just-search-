"use client";
import { useMutation } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import type { OutputTrpcType } from "@/trpc/type";
import { useChatStore } from "../store/useStore";

type MessageListType =
  | OutputTrpcType["helpAndSupportRouter"]["messageList"]
  | null;

function HelpAndSupportPrivateChat({
  chatTokenSessionId,
}: {
  chatTokenSessionId: number;
}) {
  const trpc = useTRPC();
  const allMessagesRef = React.useRef<MessageListType>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const { mutate } = useMutation(trpc.chat.markAsRead.mutationOptions());
  const zustandStoreMessages = useChatStore(
    (state) => state.zustandStoreMessages,
  );
  const liveMessages = useChatStore((state) => state.liveMessages);
  allMessagesRef.current = [...zustandStoreMessages, ...liveMessages];
  const setLiveMessage = useChatStore((state) => state.setLiveMessage);
  const { data, error } = useSubscription(
    trpc.helpAndSupportRouter.onMessage.subscriptionOptions({
      chatTokenSessionId: chatTokenSessionId,
    }),
  );
  useEffect(() => {
    if (data) {
      setLiveMessage(data);
    }
  }, [data, setLiveMessage]);

  useEffect(() => {
    const messages = allMessagesRef.current
      ?.filter((msg) => msg.sendByRole !== "User" && !msg.isRead)
      .map((msg) => msg.id);

    if (!messages?.length) {
      return;
    }

    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

    mutate({
      messageId: messages,
    });
  }, [mutate]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [allMessagesRef.current]);
  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto border border-gray-200 rounded-lg px-2 py-1 space-y-3 mb-3 bg-white relative"
    >
      <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg shadow-sm sticky top-0 left-0 right-0 ">
        <div className="border rounded-full overflow-hidden shadow ">
          <CldImage
            src={"Banner/cbycmehjeetyxbuxc6ie"}
            width="40"
            height="40"
            alt="image"
            className="rounded-full"
          />
        </div>

        <h2 className="font-semibold text-gray-800 text-lg">Admin</h2>
      </div>
      {allMessagesRef.current?.map((msg) => (
        <div key={msg.id} className="flex flex-col gap-1">
          {msg.message && (
            <div
              className={`flex px-2 py-2 rounded-xl text-sm shadow-sm w-fit ${
                msg.sendByRole === "User"
                  ? "bg-blue-100 ml-auto"
                  : "bg-gray-100"
              }`}
            >
              <h2 className="font-semibold">{msg.message}</h2>
              <span className="block text-xs text-gray-500 mt-1 mx-1">
                {msg.updatedAt
                  ? new Date(msg.updatedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function SendMessage({ chatTokenSessionId }: { chatTokenSessionId: number }) {
  const trpc = useTRPC();
  const [message, setMessage] = React.useState("");
  const { mutate, isPending } = useMutation(
    trpc.helpAndSupportRouter.sendMessage.mutationOptions(),
  );

  return (
    <div className="flex gap-2">
      <Input
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        type="text"
        placeholder="Type a message..."
      />
      <Button
        onClick={() => {
          if (message.length === 0) return;
          mutate({
            message: message,
            chatTokenSessionId: chatTokenSessionId,
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

const MemorizedPrivateChat = React.memo(HelpAndSupportPrivateChat);
const MemorizedSendMessage = React.memo(SendMessage);

export default function HelpAndSupportChat({
  chatTokenSessionId,
  messageList,
}: {
  chatTokenSessionId: number;
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
      <MemorizedPrivateChat chatTokenSessionId={chatTokenSessionId} />
      <MemorizedSendMessage chatTokenSessionId={chatTokenSessionId} />
    </div>
  );
}
