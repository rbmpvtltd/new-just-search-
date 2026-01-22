"use client";
// import { logger } from "@repo/helper";
import type { AppRouter } from "@repo/types";
import { isTRPCClientError, type TRPCClientError } from "@trpc/client";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { toast } from "sonner";
import SomethingWentWrongPage from "@/components/something-went-wrorg/SomethingWentWrong";
import { errorCodeMap } from "./errorCode";

type TRCPServerError = {
  error: TRPCClientError<AppRouter>;
  trpcError: boolean;
};

function isTRPCServerError(error: unknown): error is TRCPServerError {
  return (
    error != null &&
    typeof error === "object" &&
    "trpcError" in error &&
    error.trpcError === true
  );
}

export function ErrorComponent({ error }: { error: unknown }) {
  const router = useRouter();

  if (isTRPCClientError(error)) {
    return HandleTRPCError(error, router);
  } else if (isTRPCServerError(error)) {
    return HandleTRPCError(error.error, router);
  } else {
    return SomethingWentWrong(error);
  }
}

function SomethingWentWrong(error: unknown) {
  // TODO: send this error to Sentry or firebase logger
  // logger.error(error);
  console.error(error);
  toast.error("something went wrong", {
    style: {
      background: "red",
      color: "white",
    },
  });
  return <SomethingWentWrongPage />;
}

function HandleTRPCError(
  error: TRPCClientError<AppRouter>,
  router: ReturnType<typeof useRouter>,
): ReactNode {
  const code = error.data?.code;
  const config = errorCodeMap[code ?? "undefined"];

  if (!config) {
    return SomethingWentWrong(error);
  }

  if (config.redirect) {
    router.push(config.redirect);
  }

  if (config.toast) {
    toast.error(error.message, {
      style: {
        background: "red",
        color: "white",
      },
    });
  }

  console.log("error is ", error);
  return <div>Toast message {error.message}</div>;
}
