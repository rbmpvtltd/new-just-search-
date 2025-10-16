// "use client";
// import { log } from "@repo/helper";
// import { trpc } from "@/trpc/server";
// import { asyncHandler } from "@/utils/error/asyncHandler";
// import type { errorCodeMap } from "@/utils/error/errorCode";
// import AddBusinessPage from "@/features/business/create/add-business/AddBusinessPage";
// import UserProfile from "@/features/user/profile/UserProfile";

import MyHire from "@/features/hire/show/MyHire";
import UserProfile from "@/features/user/profile/UserProfile";

// logger.info("test", { test: "test" }, { newline: true }, { color: "red" });
export default function UserPage() {
  // log();
  console.log("test");

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
      <MyHire />
      {/* <AddHirePage data={data} /> */}
      {/* <AddBusinessPage /> */}
      {/* <UserProfile /> */}
    </div>
  );
}
