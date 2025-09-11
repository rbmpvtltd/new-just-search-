"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export default function TestTrpc() {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(trpc.hi.hi2.queryOptions());

  if (isLoading) return <div>loading ..</div>;

  return <div>{data?.itemid}</div>;
}
