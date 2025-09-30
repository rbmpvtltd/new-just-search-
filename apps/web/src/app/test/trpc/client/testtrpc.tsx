"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { ErrorComponent } from "@/utils/error/ErrorComponent";

export default function TestTrpc() {
  const trpc = useTRPC();
  const { data, isLoading, isError, error } = useQuery(
    trpc.test.test.queryOptions({ error: true }),
  );

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (isError) {
    return <ErrorComponent error={error} />;
  }
  return <div>test , {data} </div>;
}
