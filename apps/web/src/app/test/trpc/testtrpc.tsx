"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export default function TestTrpc() {
  const trpc = useTRPC();
  const { data, isLoading, isError } = useQuery(
    trpc.banners.firstBanner.queryOptions(),
  );

  if (isLoading || !data) return <div>loading ..</div>;
  if (isError) return <div>error ..</div>;
  return <div>{data[0]?.id}</div>;
}
