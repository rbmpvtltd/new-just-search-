// asyncHandler.ts

import type { AppRouter } from "@repo/types";
import { TRPCClientError } from "@trpc/client";

export async function asyncHandler<T>(promise: Promise<T>): Promise<
  | { data: T; error: null }
  | {
      data: null;
      error: { error: TRPCClientError<AppRouter>; trpcError: true };
    }
  | { data: null; error: { error: unknown; trpcError: false } }
> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    if (error instanceof TRPCClientError) {
      console.log("yes it is trpc error");
      return {
        data: null,
        error: { error, trpcError: true },
      };
    }
    console.log("yes it is not trpc error");
    return {
      data: null,
      error: { error, trpcError: false },
    };
  }
}
