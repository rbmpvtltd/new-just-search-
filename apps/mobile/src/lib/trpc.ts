import type { AppRouter } from "@repo/types";
import { QueryClient } from "@tanstack/react-query";
import {
  createTRPCClient,
  httpBatchLink,
  httpSubscriptionLink,
  splitLink,
} from "@trpc/client";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson from "superjson";
import { useAuthStore } from "@/store/authStore";
import "@azure/core-asynciterator-polyfill";
import { RNEventSource } from "rn-eventsource-reborn";
import { ReadableStream, TransformStream } from "web-streams-polyfill";
import { backendUrl } from "@/constants/Variable";

globalThis.ReadableStream = globalThis.ReadableStream || ReadableStream;
globalThis.TransformStream = globalThis.TransformStream || TransformStream;

export type OutputTrpcType = inferRouterOutputs<AppRouter>;
export type InputTrpcType = inferRouterInputs<AppRouter>;

export const queryClient = new QueryClient();
export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    // httpBatchLink({
    //   url: getTrpcUrl(),
    //   transformer: superjson,
    //   async headers() {
    //     const token = useAuthStore.getState().token;
    //     return {
    //       authorization: token ? `Bearer ${token}` : "",
    //     };
    //   },
    // }),

    splitLink({
      condition: (op) => op.type === "subscription",
      true: httpSubscriptionLink({
        transformer: superjson,
        url: getTrpcUrl(),
        EventSource: RNEventSource,
        async connectionParams() {
          const token = useAuthStore.getState().token;
          console.log("Client token", token);

          return {
            authorization: token ? `Bearer ${token}` : "",
          };
        },
      }),
      false: httpBatchLink({
        transformer: superjson,
        url: getTrpcUrl(),
        async headers() {
          const token = useAuthStore.getState().token;
          return {
            authorization: token ? `Bearer ${token}` : "",
          };
        },
      }),
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});

function getTrpcUrl() {
  const base = (() => {
    if (backendUrl)
      return backendUrl;
    return "http://192.168.1.44:4000";
  })();
  return `${base}/trpc`;
}
