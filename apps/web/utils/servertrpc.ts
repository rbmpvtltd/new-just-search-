import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "backend/route";

// export const trpc = createTRPCClient<AppRouter>({
//   links: [
//     httpLink({
//       url: "http://localhost:4000/trpc",
//     }),
//   ],
// });

export const serverTrpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:4000/trpc",
      async headers() {
        const token = localStorage.getItem("token");
        return {
          Authorization: token ? `Bearer ${token}` : "",
        };
      },
    }),
  ],
});
