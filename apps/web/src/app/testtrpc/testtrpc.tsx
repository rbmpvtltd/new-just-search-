"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export default function TestTrpc() {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.testRouter.firstData.queryOptions(),
  );

  if (isLoading) return <div>loading ..</div>;

  // ✅ No need for `isLoading` — Suspense handles loading state
  return <div>{data?.hello}</div>;
}
