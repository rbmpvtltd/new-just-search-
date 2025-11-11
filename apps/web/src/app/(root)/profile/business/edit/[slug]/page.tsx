import EditBusinessPage from "@/features/business/update/edit-business";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";

export default async function page() {
  console.log("Edit");

  const { data: referenceData, error } = await asyncHandler(
    trpcServer.businessrouter.add.query(),
  );

  const { data: userBusinessListing, error: myBusinessError } =
    await asyncHandler(trpcServer.businessrouter.show.query());

  return (
    <EditBusinessPage
      businessListing={userBusinessListing}
      formReferenceData={referenceData}
    />
  );
}
