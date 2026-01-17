"use client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import { CldImage } from "next-cloudinary";
import React, { useEffect, useState } from "react";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import type { OutputTrpcType } from "@/trpc/type";

type MessageListType =
  | OutputTrpcType["adminHelpAndSupportRouter"]["add"]
  | null;

function HelpAndSupportPrivateChat({
  chatTokenSessionId,
}: {
  chatTokenSessionId: number;
}) {
  const trpc = useTRPC();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { data: getUser } = useSuspenseQuery(
    trpc.adminHelpAndSupportRouter.getUser.queryOptions({
      chatTokenSessionId: chatTokenSessionId,
    }),
  );
  const { data: messageList } = useSuspenseQuery(
    trpc.adminHelpAndSupportRouter.add.queryOptions({
      chatTokenSessionId: chatTokenSessionId,
    }),
  );
  const [store, setStore] = useState<Exclude<MessageListType, null>>(
    messageList ?? [],
  );

  const { data } = useSubscription(
    trpc.adminHelpAndSupportRouter.onMessage.subscriptionOptions({
      chatTokenSessionId: chatTokenSessionId,
    }),
  );

  useEffect(() => {
    if (!data) return;
    setStore((prev) => [...prev, data]);
  }, [data]);

  const { mutate: markRead } = useMutation(
    trpc.adminHelpAndSupportRouter.markAsRead.mutationOptions(),
  );

  useEffect(() => {
    const unread = store
      ?.filter((msg) => msg.sendByRole !== "Admin" && !msg.isRead)
      .map((msg) => msg.id);

    if (unread.length > 0) {
      markRead({ messageId: unread });
    }
  }, [markRead, store]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messageList]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto border border-gray-200 rounded-lg px-2 py-1 space-y-3 mb-3 bg-white relative"
    >
      <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg shadow-sm sticky top-0 left-0 right-0 ">
        <div className="border rounded-full overflow-hidden shadow ">
          {getUser?.[0]?.profileImage ? (
            <CldImage
              src={getUser?.[0]?.profileImage as string}
              width="40"
              height="40"
              alt="image"
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium text-lg ">
              {getUser?.[0]?.displayName?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <h2 className="font-semibold text-gray-800 text-lg">
          {getUser?.[0]?.displayName as string}
        </h2>
      </div>
      {store.map((msg) => (
        <div key={msg.id} className="flex gap-1">
          {msg.message && (
            <div
              className={`px-2 py-2 rounded-xl text-sm shadow-sm max-w-[70%] wrap-break-word whitespace-pre-wrap w-fit ${
                msg.sendByRole === "Admin"
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
    trpc.adminHelpAndSupportRouter.sendMessage.mutationOptions(),
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
}: {
  chatTokenSessionId: number;
}) {
  return (
    <div className="p-4 max-w-md mx-auto flex flex-col h-[90vh]">
      <BoundaryWrapper>
        <MemorizedPrivateChat chatTokenSessionId={chatTokenSessionId} />
        <MemorizedSendMessage chatTokenSessionId={chatTokenSessionId} />
      </BoundaryWrapper>
    </div>
  );
}
