import { asyncHandler } from "@/utils/error/asyncHandler";
import { trpcServer } from "@/trpc/trpc-server";
import { ErrorComponent } from "@/utils/error/ErrorComponent";
import BussinessList from "@/features/business/show/BussinessList";

async function Subcategory({
  searchParams,
  params,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;  
  console.log("Id", params);
  

  return (
    <BussinessList categoryId={Number(id)}/>
  );
}

export default Subcategory;
