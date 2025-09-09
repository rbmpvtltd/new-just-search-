"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc-client";

export default function TestTrpc() {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.testRouter.firstData.queryOptions(),
  );

  if (isLoading) return <p>Loading...</p>;

  return <div>{data?.hello}</div>;
}
