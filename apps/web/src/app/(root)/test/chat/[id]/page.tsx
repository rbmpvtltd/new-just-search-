import { useMutation } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import React from "react";
import PrivateChat from "@/features/test/PrivateChat";
import { useTRPC } from "@/trpc/client";
export default async function Page({
  params,
}: {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  console.log("ID", id);

  return <PrivateChat receiverId={String(id)} />;
}
