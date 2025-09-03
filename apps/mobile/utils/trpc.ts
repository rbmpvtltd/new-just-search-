import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "backend/router";
import { useAuthStore } from "@/store/authStore";


export const trpc = createTRPCClient<AppRouter>({
    
  links: [
    httpBatchLink({
      url: "http://localhost:4000/trpc",
      async headers() {
        const token = useAuthStore.getState().token;

        // const token = "hiadf.eice";
        return {
          authorization: token ? `Bearer ${token}` : "",
        };
      },
    }),
  ],
});
