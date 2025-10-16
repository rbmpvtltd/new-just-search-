import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "types/index";
import { getTrpcUrl } from "@/trpc/helper";
import { getToken } from "./session";

export const trpc = createTRPCClient<AppRouter>({
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
