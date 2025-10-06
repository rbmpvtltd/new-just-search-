import FirstCaraousel from "@/features/business/mainContent/BannerFistCaraousel";
import Category from "@/features/business/mainContent/Category";
import PopularaBanner from "@/features/business/mainContent/PopularaBanner";
import PremiumShop from "@/features/business/mainContent/PremiumShop";
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

  return (
    <div className="mx-auto">
      <FirstCaraousel bannerFirst={bannerFirst} />
      <Category category={category} allCategory={allCategory} />
      <PremiumShop />
      <PopularaBanner popularCategories={popularCategories} allCategories={allCategory} />
    </div>
  );
}
