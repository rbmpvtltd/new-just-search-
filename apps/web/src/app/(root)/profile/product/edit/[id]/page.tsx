import EditProduct from "@/features/product/forms/update/EditProdut";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";

export default async function page({
  params,
}: {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;

  const { data: referenceData, error } = await asyncHandler(
    trpcServer.productrouter.add.query(),
  );

  const { data: myProduct, error: myBusinessError } = await asyncHandler(
    trpcServer.productrouter.edit.query({ id: Number(id) ?? "" }),
  );

  return (
    <EditProduct myProduct={myProduct} formReferenceData={referenceData} />
  );
}
