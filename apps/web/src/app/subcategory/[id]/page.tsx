import { getPagination } from "@/utils/getPagination";

import { asyncHandler } from "@/utils/error/asyncHandler";
import { trpcServer } from "@/trpc/trpc-server";
import { ErrorComponent } from "@/utils/error/ErrorComponent";
import { BussinessListingCard } from "@/features/business/show/component/BussinessListingCard";
import BussinessList from "@/features/business/show/BussinessList";

async function Subcategory({
  searchParams,
  params,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const getsearchParams = await searchParams;
  const page = Number(getsearchParams.page ?? 1);
  const {data , error} = await asyncHandler(trpcServer.subcategoryRouter.subcategory.query({
    categoryId: Number(id),
    page: page,
    limit: 10,
  }))

  if(error){
    return <ErrorComponent error={error} />
  }

  console.log({data});
  console.log({page ,id});

  return (
    <BussinessList business={data?.data} page={data?.page} totalPages={data?.totalPages} id={id}/>
  );
}

export default Subcategory;
