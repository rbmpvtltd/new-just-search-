import EditHirePage from "@/features/hire/update/edit-hire";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";

export default async function page() {
  const { data: referenceData, error } = await asyncHandler(
    trpcServer.hirerouter.add.query(),
  );

  const { data: userHireListing, error: myHireError } = await asyncHandler(
    trpcServer.hirerouter.show.query(),
  );
  return (
    <EditHirePage
      hireListing={userHireListing}
      formReferenceData={referenceData}
    />
  );
}
