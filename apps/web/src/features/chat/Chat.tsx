"use client";
import Link from "next/link";
import type { OutputTrpcType } from "@/trpc/type";

type Conversation = OutputTrpcType["chat"]["conversationList"] | null;
export default function ConversationList({
  conversationList,
}: {
  conversationList: Conversation;
}) {
  console.log("Conversation", conversationList);

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
                    {conversation.profileImage
                      ? conversation.profileImage
                      : String(conversation?.displayName)
                          .charAt(0)
                          .toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold">
                      {String(conversation?.displayName)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {/* {conversationList && conversationList?.pop()} */}
                    </p>
                  </div>
                </div>

                <span className="text-xs text-gray-400">
                  {conversation.updatedAt
                    ? new Date(conversation.updatedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
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
