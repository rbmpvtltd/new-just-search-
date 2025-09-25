// handleTRPCError.ts
import { logger } from "@repo/helper";
import type { AppRouter } from "@repo/types";
import type { TRPCClientError } from "@trpc/client";
import type { NextRouter } from "next/router";
import { errorCodeMap } from "./errorCode";

export function handleTRPCError<T>(
  error: TRPCClientError<AppRouter>,
  navigator?: NextRouter | ((url: string) => void),
): { data: T | null; error: string | null; redirect?: string } {
  const code = error.data?.code;
  const config = errorCodeMap[code ?? "undefined"];

  if (!config) {
    logger.error(error);
    return { data: null, error: error.message || "Unknown error occurred" };
  }

  // Trigger redirect if applicable
  if (config.redirect && navigator) {
    if (typeof navigator === "function") {
      navigator(config.redirect);
    } else if ("push" in navigator) {
      navigator.push(config.redirect);
    }
  }

  // Optionally show toast (UI component logic)
  if (config.toast) {
    // Render or trigger toast somehow
    // For example, you can call a global toast function:
    // toast(config.toast);
    console.log("Toast:", config.toast);
  }

  return {
    data: null,
    error: config.message || error.message || "An error occurred",
    redirect: config.redirect,
  };
}
