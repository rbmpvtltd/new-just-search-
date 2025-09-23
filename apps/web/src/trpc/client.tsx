"use client";
import type { AppRouter } from "@repo/types";
// ^-- to make sure we can mount the Provider from a server component
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	createTRPCClient,
	httpBatchLink,
	createWSClient,
	wsLink,
	splitLink,
} from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { useState } from "react";
import superjson from "superjson";
import { getToken } from "@/utils/session";
import { getTrpcUrl, getWsUrl } from "./helper";
import { makeQueryClient } from "./query-client";

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

const wsClient = createWSClient({
	url: `ws://localhost:5500`,
});

let browserQueryClient: QueryClient;
function getQueryClient() {
	if (typeof window === "undefined") {
		// Server: always make a new query client
		return makeQueryClient();
	}

	if (!browserQueryClient) browserQueryClient = makeQueryClient();
	return browserQueryClient;
}
export function TRPCReactProvider(
	props: Readonly<{
		children: React.ReactNode;
	}>,
) {
	const queryClient = getQueryClient();
	const [trpcClient] = useState(() =>
		createTRPCClient<AppRouter>({
			links: [
				splitLink({
					condition: (op) => op.type === "subscription",
					true: wsLink({
						client: createWSClient({
							url: getWsUrl(),
						}),
						transformer: superjson,
					}),
					false: httpBatchLink({
						transformer: superjson,
						url: getTrpcUrl(),
						async headers() {
							const token = await getToken();
							return {
								authorization: token ? `Bearer ${token.value}` : "",
							};
						},
					}),
				}),
			],
		}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			<TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
				{props.children}
			</TRPCProvider>
		</QueryClientProvider>
	);
}
