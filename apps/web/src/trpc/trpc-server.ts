import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "types/index";
import { getTrpcUrl } from "@/utils";
import { getToken } from "@/utils/session";

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
