import { SingleShopTabBar } from "@/features/business/show/SingleShop";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";


async function SingleShop({params}:{params: Promise<{ [key: string]: string | string[] | undefined }>;}) {
    const { id } = await params;
    const {data,error} = await asyncHandler(trpcServer.businessrouter.singleShop.query({businessId:Number(id)}))
  return (
    <div>
      <SingleShopTabBar businessPhotos={data?.businessPhotos} shop={data}/>
    </div>
  )
}

export default SingleShop
