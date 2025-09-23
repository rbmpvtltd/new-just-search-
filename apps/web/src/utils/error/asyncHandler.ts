import type { AppRouter } from "@repo/types";
import type { TRPCClientError } from "@trpc/client";
import { handleTRPCError } from "./handleTRPCError";

export async function asyncHandler<T>(
	promise: Promise<T>,
): Promise<{ data: T | null; error: string | null }> {
	try {
		const data = await promise;
		console.log("data", data);

		return { data, error: null };
	} catch (error: unknown) {
		if ((error as TRPCClientError<AppRouter>)?.data) {
			const message = handleTRPCError(error as TRPCClientError<AppRouter>);
			return { data: null, error: message };
		}
		return { data: null, error: "Unknown error occurred" };
	}
}
