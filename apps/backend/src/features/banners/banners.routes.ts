import z from "zod";
import { publicProcedure, router } from "@/utils/trpc";
import { getBannerData, premiumShops } from "./banners.service";

export const bannerRouter = router({
  getBannerData: publicProcedure
    .input(z.object({ type: z.number() }))
    .query(async ({ input }) => {
      const data = getBannerData(input.type);
      return data;
    }),

  premiumShops: publicProcedure.query(async () => {
    const data = premiumShops();
    return data;
  }),
});
