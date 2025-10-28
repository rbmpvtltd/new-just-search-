import AddProduct from "@/features/product/forms/create/AddProduct";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";

export default async function page() {
  const { data: referenceData, error } = await asyncHandler(
    trpcServer.businessrouter.add.query(),
  );

  return <AddProduct formReferenceData={referenceData} />;
}
