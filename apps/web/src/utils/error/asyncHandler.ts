import type { AppRouter } from "@repo/types";
import { TRPCClientError } from "@trpc/client";
import type { AxiosError } from "axios";
import { redirect } from "next/navigation";
import { handleTRPCError } from "./handleTRPCError";

export async function asyncHandler<T>(promise: Promise<T>): Promise<T | void> {
  try {
    return await promise;
  } catch (error) {
    if (error instanceof TRPCClientError) {
      return handleTRPCError(error, redirect);
    }
    //  else if ((error as AxiosError).isAxiosError) {
    //   handleTRPCError(error as AxiosError);
    // }
    else {
      // TODO: handle unexpected errors
      console.error("Unkaown error");
    }
  }
}
