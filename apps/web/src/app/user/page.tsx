// import { log } from "@repo/helper";
// import { trpc } from "@/trpc/server";
// import { asyncHandler } from "@/utils/error/asyncHandler";
// import type { errorCodeMap } from "@/utils/error/errorCode";
"use client";
import AddBusinessPage from "@/features/business/create/add-business/AddBusinessPage";
import AddHirePage from "@/features/hire/create/add-hire/AddHirePage";

// logger.info("test", { test: "test" }, { newline: true }, { color: "red" });
export default async function UserPage() {
  // log();
  // logger.info(
  //   "test",
  //   { test: "test", error: { code: "BAD_REQUEST" } },
  //   { newline: true },
  //   { color: "red" },
  // );
  //
  // const testCode: keyof typeof errorCodeMap = "BAD_REQUEST";
  //
  // const { data, error, redirect } = await asyncHandler(
  //   trpc.auth.getUser.query(),
  // );
  //
  // if (error) {
  //   console.log("Error:", error);
  // }
  // if (redirect) {
  //   console.log("Redirect to:", redirect);
  // }
  //
  return (
    <div>
      <AddHirePage />
      {/* <AddBusinessPage /> */}
    </div>
  );
}
