import type { AppRouter } from "@repo/types";
import type { TRPCClientError } from "@trpc/client";
import { errorCodeMap } from "./errorCode";

export function handleTRPCError(error: TRPCClientError<AppRouter>) {
	const code = error.data?.code;
	const errorMessage = error.message;
	const config = errorCodeMap[code ?? "undefined"];

	if (!config) {
		console.error("Unknown error code:", code);
		return { message: "Something went wrong!", redirect: undefined };
	}

	return {
		message: errorMessage || config.message || "An error occurred",
		redirect: config.redirect,
	};
}
