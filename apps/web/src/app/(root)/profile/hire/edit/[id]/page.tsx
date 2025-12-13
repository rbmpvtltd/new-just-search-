import React from "react";
import EditHirePage from "@/features/hire/update/edit-hire";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";

export default async function page({
  params,
}: {
  params: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}) {
  const { id } = await params;

  const { data: userHireListing, error: myHireError } = await asyncHandler(
    trpcServer.hirerouter.edit.query({
      id: Number(id),
    }),
  );

  if (myHireError) {
    return <h1>Something Went Wrong</h1>;
  }
  return <EditHirePage hireListing={userHireListing} />;
}
