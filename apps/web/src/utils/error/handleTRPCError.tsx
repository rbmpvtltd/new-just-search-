import type { AppRouter } from "@repo/types";
import type { TRPCClientError } from "@trpc/client";
import { errorCodeMap } from "./errorCode";

export function handleTRPCError(error: TRPCClientError<AppRouter>): string {
	console.log("error", error);

	const code = error.data?.code;
	const config = errorCodeMap[code ?? "undefined"];

	if (!config) {
		console.error("Unknown error code:", code);
		return "Something went wrong!";
	}

	return config.message || error.message || "An error occurred";
}
