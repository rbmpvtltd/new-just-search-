import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "backend/route";
import { getToken } from "./session";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:4000/trpc",
      async headers() {
        const token = await getToken();
        // const token = "hiadf.eice";
        return {
          authorization: token ? `Bearer ${token.value}` : "",
        };
      },
    }),
  ],
});
