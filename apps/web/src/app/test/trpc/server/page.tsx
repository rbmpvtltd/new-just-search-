import { logger } from "@repo/helper";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";
import { ErrorComponent } from "@/utils/error/ErrorComponent";

export default async function TRPCTEST() {
  const { data, error } = await asyncHandler(
    trpcServer.test.test.query({ error: true }),
  );
  if (error) {
    logger.error(error);
    return <ErrorComponent error={error} />;
  }
  return <div>test , {data} </div>;
}
