import EditProduct from "@/features/product/forms/update/EditProdut";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";

export default async function page({
  params,
}: {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { productSlug } = await params;

  const slug = Array.isArray(productSlug) ? productSlug[0] : productSlug;
  const { data: referenceData, error } = await asyncHandler(
    trpcServer.businessrouter.add.query(),
  );

  const { data: myProduct, error: myBusinessError } = await asyncHandler(
    trpcServer.productrouter.edit.query({ productSlug: slug ?? "" }),
  );

  return (
    <EditProduct myProduct={myProduct} formReferenceData={referenceData} />
  );
}
