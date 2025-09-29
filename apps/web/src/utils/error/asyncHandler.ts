// asyncHandler.ts

import { logger } from "@repo/helper";
import { TRPCClientError } from "@trpc/client";
import { handleTRPCError } from "./handleTRPCError";

export async function asyncHandler<T>(
  promise: Promise<T>,
): Promise<{ data: T | null; error: string | null }> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    if (error instanceof TRPCClientError) {
      return handleTRPCError<T>(error);
    } else {
      logger.error("Unknown error", error);
      return { data: null, error: "Unknown error occurred" };
    }
  }
}
