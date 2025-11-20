"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { useEffect } from "react";
import { useTRPC } from "@/trpc/client";
import { getQueryClient } from "@/trpc/query-client";
import type { OutputTrpcType } from "@/trpc/type";

type Conversation = OutputTrpcType["chat"]["conversationList"] | null;
export default function ConversationList({
  conversationList,
}: {
  conversationList: Conversation;
}) {
  // const pathname = usePathname();
  // const searchParams = useSearchParams();
  const trpc = useTRPC();
  // const {
  //   data: conversationList,
  //   error,
  //   isLoading,
  // } = useQuery(trpc.chat.conversationList.queryOptions());

  console.log("Conversation", conversationList);
  // useEffect(() => {
  //   console.log("use effect is mounted");
  //   const handleFocus = () => {
  //     const quryClient = getQueryClient();
  //     quryClient.invalidateQueries({
  //       queryKey: trpc.chat.conversationList.queryKey(),
  //     });
  //     // Or refetch specific query:
  //     // queryClient refetchQueries({ queryKey: ['posts', ...] })
  //   };

  //   window.addEventListener("focus", handleFocus);
  //   return () => window.removeEventListener("focus", handleFocus);
  // }, [pathname, searchParams]);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }
  return (
    <div
      style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}
    >
      <h2 className="text-2xl font-semibold mb-4">Messages</h2>
      <div className="space-y-10">
        {conversationList && conversationList?.length > 0 ? (
          conversationList?.map((conversation) => (
            <Link key={conversation.id} href={`/chat/${conversation.id}`}>
              <div
                key={conversation.id}
                className="flex items-center justify-between p-4 m-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
              >
                <div className="flex items-center space-x-3 gap-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium text-lg ">
                    {conversation.profileImage ? (
                      <CldImage
                        src={conversation.profileImage}
                        width="40"
                        height="40"
                        alt="image"
                        className="rounded-full"
                      />
                    ) : (
                      String(conversation?.displayName).charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold">
                      {String(conversation?.displayName)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {conversation.lastMessage}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs text-gray-400">
                    {conversation.updatedAt
                      ? new Date(conversation.updatedAt).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )
                      : ""}
                  </span>

                  {conversation.unreadCount > 0 && (
                    <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>no messages</p>
        )}
      </div>
    </div>
  );
}
