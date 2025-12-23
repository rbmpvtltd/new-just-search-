import EditOffer from "@/features/offer/forms/update/EditOffer";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";

export default async function page({
  params,
}: {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  
  const { data: referenceData, error } = await asyncHandler(
    trpcServer.offerrouter.add.query(),
  );

  const { data: myOffer, error: myBusinessError } = await asyncHandler(
    trpcServer.offerrouter.edit.query({ id: Number(id) ?? "" }),
  );

  return <EditOffer myOffer={myOffer} formReferenceData={referenceData} />;
}
