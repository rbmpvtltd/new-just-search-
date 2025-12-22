import { asyncHandler } from "@/utils/error/asyncHandler";
import { trpcServer } from "@/trpc/trpc-server";
import { ErrorComponent } from "@/utils/error/ErrorComponent";
import BussinessList from "@/features/business/show/BussinessList";

async function Subcategory({
  params,
}: {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { subcategory } = await params;
  console.log("==================>", subcategory);
  console.log("========fdsf=====>", params);
  return <BussinessList categoryId={Number(subcategory)} />;
}

export default Subcategory;
