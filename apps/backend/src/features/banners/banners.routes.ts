import { publicProcedure, router } from "@/utils/trpc";
import { getFirstBannerData } from "./banners.service";

export const bannerRouter = router({
  first: publicProcedure.query(async () => {
    const data = getFirstBannerData();
    return data;
  }),
});
