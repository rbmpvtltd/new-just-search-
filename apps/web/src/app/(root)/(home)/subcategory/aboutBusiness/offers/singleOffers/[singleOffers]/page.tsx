import SingleOfferComp from "@/features/business/show/SingleOffer";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";

async function SingleProduct({
  params,
}: {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { singleOffers: id } = await params;
  const { data, error } = await asyncHandler(
    trpcServer.businessrouter.singleOffer.query({ offerId: Number(id) }),
  );
  return (
    <div>
      <SingleOfferComp offerPhotos={data?.photos ?? []} offer={data} />
    </div>
  );
}

export default SingleProduct;
