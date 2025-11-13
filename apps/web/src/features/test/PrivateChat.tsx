"use client";
import { useMutation } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import React from "react";
import { useTRPC } from "@/trpc/client";
export default function PrivateChat({ receiverId }: any) {
  const [message, setMessage] = React.useState("");

  console.log("Message", message);

  // Mock previous messages (you’ll replace this with API or DB data)
  const messages = [
    { id: 1, sender: "You", text: "Hey, how are you?" },
    { id: 2, sender: "User", text: "I'm good! What about you?" },
    { id: 3, sender: "You", text: "Doing great, thanks!" },
  ];

  const trpc = useTRPC();

  const { data, error, status, reset } = useSubscription(
    trpc.test.onMessage.subscriptionOptions({
      userId: String(receiverId),
    }),
  );

  const { mutate, isPending } = useMutation(
    trpc.test.sendMessage.mutationOptions(),
  );

  return (
    <div className="p-4 max-w-md mx-auto flex flex-col h-[90vh]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto border border-gray-200 rounded p-3 space-y-2 mb-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded text-sm max-w-[80%] ${
              msg.sender === "You"
                ? "bg-blue-100 self-end ml-auto"
                : "bg-gray-100"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

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
              userId: String(receiverId),
              message: message,
            });
          }}
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isPending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
