import { publicProcedure, router } from "@/utils/trpc";
import {
  getFourthBannerData,
  getSecondBannerData,
  getThirdBannerData,
} from "./banners.service";

export const bannerRouter = router({
  secondBanner: publicProcedure.query(async () => {
    const data = getSecondBannerData();
    return data;
  }),

  thirdBanner: publicProcedure.query(async () => {
    const data = getThirdBannerData();
    return data;
  }),

  fourthBanner: publicProcedure.query(async () => {
    const data = getFourthBannerData();
    return data;
  }),
});
