export const dynamic = "force-dynamic";

import HomeSearchBar from "@/components/home-searchbar";
import UpdateDisplayNameForm from "@/features/auth/login/display-update";
import AddvertiseBanner from "@/features/business/mainContent/AddvertiseBanner";
import AddvertiseBanner2 from "@/features/business/mainContent/AddvertiseBanner2";
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
  const { data: addvertiseBanner } = await asyncHandler(
    trpcServer.banners.getBannerData.query({ type: 2 }),
  );
  const { data: addvertiseBanner2 } = await asyncHandler(
    trpcServer.banners.getBannerData.query({ type: 3 }),
  );
  const { data: userData } = await asyncHandler(
    trpcServer.userRouter.getUserDetail.query(),
  );

  if (!userData?.displayName || userData.displayName === "null") {
      return (
        <div className="w-full">
          <UpdateDisplayNameForm userId={Number(userData?.id)} />
        </div>
      );
    }

  if (error) return <ErrorComponent error={error} />;

  return (
    <div className="mx-auto">
      <FirstCaraousel bannerFirst={bannerFirst} />
      <HomeSearchBar />
      <Category category={category} allCategory={allCategory} />
      <PremiumShop />
      <PopularaBanner
        popularCategories={popularCategories}
        allCategories={allCategory}
      />
      <AddvertiseBanner addvertiseBanner={addvertiseBanner} />
      <AddvertiseBanner2 addvertiseBanner={addvertiseBanner2} />
    </div>
  );
}
