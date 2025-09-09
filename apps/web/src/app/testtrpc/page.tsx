import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { useTRPC } from "@/lib/trpc-client";
import TestTrpc from "./testtrpc";

export default async function TRPCTEST() {
  const queryClient = new QueryClient();
  const trpc = useTRPC();

  // prefetch data server-side
  await queryClient.prefetchQuery(trpc.testRouter.firstData.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TestTrpc />
    </HydrationBoundary>
  );
}
