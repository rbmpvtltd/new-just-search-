import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import TestTrpc from "./testtrpc";

export default async function TRPCTEST() {
  prefetch(trpc.testRouter.firstData.queryOptions());
  return (
    <HydrateClient>
      <TestTrpc />
    </HydrateClient>
  );
}
