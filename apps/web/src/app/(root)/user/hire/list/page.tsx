import { logger } from "@repo/helper";
import React from "react";
import AddHirePage from "@/features/hire/create/add-hire";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";
import { ErrorComponent } from "@/utils/error/ErrorComponent";

export default async function page() {
  const { data, error } = await asyncHandler(trpcServer.hirerouter.add.query());

  if (error) {
    console.log("error", error);
    logger.error(error);
    return <ErrorComponent error={error} />;
  }

  return (
    <div>
      <AddHirePage data={data} />
    </div>
  );
}
