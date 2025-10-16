import { logger } from "@repo/helper";
import React from "react";
import AddHirePage from "@/features/hire/create/add-hire";
import MyHire from "@/features/hire/show/MyHire";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";
import { ErrorComponent } from "@/utils/error/ErrorComponent";

export default async function page() {
  const { data, error } = await asyncHandler(trpcServer.hirerouter.add.query());
  const { data: myHire, error: myHireError } = await asyncHandler(
    trpcServer.hirerouter.show.query(),
  );
  console.log("myHire", myHire);

  if (error || !myHire) {
    console.log("error", error);
    logger.error(error);
    return <ErrorComponent error={error} />;
  }
  if (myHireError) {
    console.log("myHireError", myHireError);
    logger.error(myHireError);
    return <ErrorComponent error={myHireError} />;
  }

  return (
    <div>{myHire ? <MyHire data={myHire} /> : <AddHirePage data={data} />}</div>
  );
}
