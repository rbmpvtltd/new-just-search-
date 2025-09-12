import type { AppRouter } from "@repo/types";
import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson from "superjson";
import { getToken } from "@/utils/secureStore";

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
    if (process.env.URL) return `https://${process.env.URL}`;
    return "http://localhost:4000";
  })();
  return `${base}/trpc`;
}
