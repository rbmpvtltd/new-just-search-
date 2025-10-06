import FirstCaraousel from "@/components/mainContent/BannerFistCaraousel";
import Category from "@/components/mainContent/Category";
import PremiumShop from "@/components/mainContent/PremiumShop";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";
import { ErrorComponent } from "@/utils/error/ErrorComponent";

export default async function Page() {
  const { data: bannerFirst } = await asyncHandler(
    trpcServer.banners.getBannerData.query({ type: 1 }),
  );
  const { data: category, error } = await asyncHandler(
    trpcServer.categoryRouter.popularCategories.query(),
  );
  const { data: popularCategories } = await asyncHandler(
    trpcServer.categoryRouter.popularBannerCategory.query(),
  );
  const { data: allCategory } = await asyncHandler(
    trpcServer.categoryRouter.allCategories.query(),
  );

  if (error) return <ErrorComponent error={error} />;
  console.log("popularCategories ==========================>",popularCategories)

  return (
    <div className="mx-auto">
      <FirstCaraousel bannerFirst={bannerFirst} />
      <Category category={category} allCategory={allCategory} />
      <PremiumShop />
    </div>
  );
}
