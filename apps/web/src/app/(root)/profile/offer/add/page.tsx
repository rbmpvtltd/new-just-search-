export const dynamic = "force-dynamic";

import AddOffer from "@/features/offer/forms/create/AddOffer";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";

export default async function page() {
  const { data: referenceData, error } = await asyncHandler(
    trpcServer.offerrouter.add.query(),
  );

  return <AddOffer formReferenceData={referenceData} />;
}
