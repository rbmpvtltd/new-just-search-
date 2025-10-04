import FirstCaraousel from "@/components/mainContent/BannerFistCaraousel";
import Category from "@/components/mainContent/Category";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";


export default async function Page() {
  
  const { data: bannerFirst } = await asyncHandler(trpcServer.banners.getBannerData.query({type : 1}))
  const { data: category } = await asyncHandler(trpcServer.categoryRouter.popularCategories.query());
  const { data: allCategory } = await asyncHandler(trpcServer.categoryRouter.allCategories.query());
  return (
    <div className="mx-auto">
      <FirstCaraousel bannerFirst={bannerFirst}/>
      <Category category={category} allCategory={allCategory}/>
    </div>
  );
}
