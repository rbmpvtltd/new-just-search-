import SingleProductComp from "@/features/business/show/SingleProduct";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";

async function SingleProduct({
  params,
}: {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const { data, error } = await asyncHandler(
    trpcServer.businessrouter.singleProduct.query({ productId: Number(id) }),
  );
  console.log("data -=---------------------->", data);
  return (
    <div>
      <SingleProductComp productPhotos={data?.photos ?? []} product={data} />
    </div>
  );
}

export default SingleProduct;
