// asyncHandler.ts

import { isTRPCClientError } from "@trpc/client";

export async function asyncHandler<T>(
  promise: Promise<T>,
): Promise<
  | { data: T; error: null }
  | { data: null; error: { error: unknown; trpcError: boolean } }
> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: { error, trpcError: isTRPCClientError(error) },
    };
  }
}
