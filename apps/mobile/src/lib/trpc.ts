import type { AppRouter } from "@repo/types";
import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson from "superjson";
import { getToken } from "@/utils/secureStore";
import type { inferRouterOutputs , inferRouterInputs } from "@trpc/server";

export type OutputTrpcType = inferRouterOutputs<AppRouter>
export type InputTrpcType = inferRouterInputs<AppRouter>


export const queryClient = new QueryClient();
const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: getTrpcUrl(),
      transformer: superjson,
      async headers() {
        const token = await getToken();
        return {
          authorization: token ? `Bearer ${token}` : "",
        };
      },
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});

function getTrpcUrl() {
  const base = (() => {
    if (process.env.BACKEND_URL) return process.env.BACKEND_URL;
    return "http://192.168.1.44:4000";
  })();
  return `${base}/trpc`;
}
