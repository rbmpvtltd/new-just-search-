import AddOffer from "@/features/offer/forms/add-offer/AddOffer";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";

export default async function page() {
  const { data: referenceData, error } = await asyncHandler(
    trpcServer.businessrouter.add.query(),
  );

  return <AddOffer formReferenceData={referenceData} />;
}
