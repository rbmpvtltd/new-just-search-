import { redirect } from "next/navigation";
import { TRPCClientError } from "@trpc/client";
import type { errorCodeMap } from "@/utils/error/errorCode";
import { asyncHandler } from "@/utils/error/asyncHandler";

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

export default async function UserPage() {
  // Choose the error code to test
  const testCode: keyof typeof errorCodeMap = "BAD_REQUEST"; // change this to test other codes

  const user = await asyncHandler(mockTRPC.auth.getUser.query(testCode));

  if (!user) return <div>Error occurred (redirect handled)</div>;

  return <div>Welcome {user.name}</div>;
}
