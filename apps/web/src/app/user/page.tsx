import { logger } from "@repo/helper";
import { TRPCClientError } from "@trpc/client";
import { trpc } from "@/trpc/server";
import { asyncHandler } from "@/utils/error/asyncHandler";
import type { errorCodeMap } from "@/utils/error/errorCode";

// Fake tRPC server for testing
const mockTRPC = {
  auth: {
    getUser: {
      query: async (code: keyof typeof errorCodeMap) => {
        // Simulate error
        throw new TRPCClientError({ data: { code } } as any);
      },
    },
  },
};

logger.info("test", { test: "test" }, { newline: true }, { color: "red" });
export default async function UserPage() {
  logger.info(
    "test",
    { test: "test", error: { code: "BAD_REQUEST"} },
    { newline: true },
    { color: "red" },
  );

  const testCode: keyof typeof errorCodeMap = "BAD_REQUEST";

  const { data, error, redirect } = await asyncHandler(
    trpc.auth.getUser.query(),
  );

  if (error) {
    console.log("Error:", error);
  }
  if (redirect) {
    console.log("Redirect to:", redirect);
  }

  return <div>{data}</div>;
}
