import { logger } from "@repo/helper";
import React from "react";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";
import { ErrorComponent } from "@/utils/error/ErrorComponent";

export default async function page() {
  const { data, error } = await asyncHandler(trpcServer.hirerouter.add.query());
  console.log("data=-==---------------------------------------", data);
  if (error) {
    console.log("error", error);

    logger.error(error);
    return <ErrorComponent error={error} />;
  }

  return <div></div>;
}
