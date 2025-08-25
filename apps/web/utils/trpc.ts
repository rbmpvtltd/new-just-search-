import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "backend/route";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:4000/trpc",
    }),
  ],
});
