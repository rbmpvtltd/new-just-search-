// import { Suspense } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useTRPC } from "@/trpc/client";
//
// import { trpcServer } from "@/trpc/trpc-server";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import TestTrpc from "./testtrpc";

export default async function TRPCTEST() {
  prefetch(trpc.hi.hi2.queryOptions());

  // const data = await trpcServer.hi.hi2.query();
  // const trpc = useTRPC();
  // const { data, isLoading } = useQuery(
  //   trpc.testRouter.firstData.queryOptions(),
  // );

  // if (isLoading) return <p>Loading...</p>;
  //
  // return <div>{data?.hello}</div>;
  return (
    <div>
      <HydrateClient>
        <TestTrpc />
      </HydrateClient>
    </div>
  );
}
