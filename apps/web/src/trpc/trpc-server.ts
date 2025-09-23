import type { AppRouter } from "@repo/types";
import { createTRPCClient, createWSClient, httpBatchLink, wsLink } from "@trpc/client";
import superjson from "superjson";
import { getToken } from "@/utils/session";
import { getTrpcUrl, getWsUrl } from "./helper";

// Your existing typed client
export const trpcServer = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: getTrpcUrl(),
      transformer: superjson,
      async headers() {
        const token = await getToken();
        return {
          authorization: token ? `Bearer ${token.value}` : "",
        };
      },
    }),
    wsLink({
      client : createWSClient({
        url : getWsUrl()
      }),
      transformer : superjson
    })
  ],
});
