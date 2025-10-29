import EditOffer from "@/features/offer/forms/update/EditOffer";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";

interface OfferEditPageProps {
  params: {
    offerSlug: string;
  };
}
export default async function page({ params }: OfferEditPageProps) {
  const { offerSlug } = params;
  console.log("param", offerSlug);

  const { data: referenceData, error } = await asyncHandler(
    trpcServer.businessrouter.add.query(),
  );

  const { data: myOffer, error: myBusinessError } = await asyncHandler(
    trpcServer.offerrouter.edit.query({ offerSlug }),
  );

  return <EditOffer myOffer={myOffer} formReferenceData={referenceData} />;
}
