import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "@repo/types";
import { getToken } from "@/utils/session";
import { getTrpcUrl } from "./helper";

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
  ],
});
