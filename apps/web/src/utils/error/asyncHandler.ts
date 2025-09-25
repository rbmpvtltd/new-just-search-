// asyncHandler.ts
import { TRPCClientError } from "@trpc/client";
import { redirect } from "next/navigation";
import { handleTRPCError } from "./handleTRPCError";

export async function asyncHandler<T>(
  promise: Promise<T>,
): Promise<{ data: T | null; error: string | null; redirect?: string }> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    if (error instanceof TRPCClientError) {
      return handleTRPCError<T>(error, redirect);
    } else {
      console.error("Unknown error", error);
      return { data: null, error: "Unknown error occurred" };
    }
  }
}
