import { useParams } from "next/navigation";
import EditProduct from "@/features/product/forms/update/EditProdut";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";

export default async function page({searchParams}:{searchParams: Promise<{ [key: string]: string | string[] | undefined }>;}) {
  const getsearchParams = await searchParams;
  const page = Number(getsearchParams.page ?? 1);
  console.log("page params is",page)

  const { data: referenceData, error } = await asyncHandler(
    trpcServer.businessrouter.add.query(),
  );

  const { data: myProducts, error: myBusinessError } = await asyncHandler(
    trpcServer.businessrouter.showProduct.query(),
  );

  return (
    <EditProduct myProducts={myProducts} formReferenceData={referenceData} />
  );
}
