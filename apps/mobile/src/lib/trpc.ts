import type { AppRouter } from "@repo/types";
import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson from "superjson";
import { useAuthStore } from "@/store/authStore";

export type OutputTrpcType = inferRouterOutputs<AppRouter>;
export type InputTrpcType = inferRouterInputs<AppRouter>;

export const queryClient = new QueryClient();
const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: getTrpcUrl(),
      transformer: superjson,
      async headers() {
        const token = useAuthStore.getState().token;
        console.log(
          "token in trpc lib file $444444$$$4$*888888888888888****",
          token,
        );
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
    console.log("backend expo is ", process.env.EXPO_PUBLIC_BACKEND_URL);
    if (process.env.EXPO_PUBLIC_BACKEND_URL)
      return process.env.EXPO_PUBLIC_BACKEND_URL;
    return "http://192.168.1.44:4000";
  })();
  return `${base}/trpc`;
}
