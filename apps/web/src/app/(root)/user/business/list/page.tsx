import { logger } from "@repo/helper";
import AddBusinessPage from "@/features/business/create/add-business";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";
import { ErrorComponent } from "@/utils/error/ErrorComponent";

export default async function page() {
  const { data, error } = await asyncHandler(
    trpcServer.businessrouter.add.query(),
  );

  if (error) {
    logger.error(error);
    return <ErrorComponent error={error} />;
  }
  return (
    <div>
      <AddBusinessPage data={data} />
    </div>
  );
}
