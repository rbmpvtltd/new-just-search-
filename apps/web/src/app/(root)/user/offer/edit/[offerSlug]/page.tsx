import EditOffer from "@/features/offer/forms/update/EditOffer";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";

interface OfferEditPageProps {
  params: {
    offerSlug: string;
  };
}
export default async function page({ params }: { params: Promise<{ [key: string]: string | string[] | undefined }>;}) {
  const { offerSlug } =  await params;
  const slug = Array.isArray(offerSlug) ? offerSlug[0] : offerSlug
  console.log("param", offerSlug);

  const { data: referenceData, error } = await asyncHandler(
    trpcServer.businessrouter.add.query(),
  );

  const { data: myOffer, error: myBusinessError } = await asyncHandler(
    trpcServer.offerrouter.edit.query({ offerSlug : slug ?? "" }),
  );

  return <EditOffer myOffer={myOffer} formReferenceData={referenceData} />;
}
