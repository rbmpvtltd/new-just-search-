import { publicProcedure } from "@/utils/trpc";
import { getFirstBannerData, getSecondBannerData,getThirdBannerData,getFourthBannerData} from "./banners.service";

export const bannerRouter = {
  firstBanner : publicProcedure.query(async ()=>{
      const data = getFirstBannerData()
      return data
  }),

  secondBanner : publicProcedure.query(async ()=>{
      const data = getSecondBannerData()
      return data
  }),

  thirdBanner : publicProcedure.query(async ()=>{
      const data = getThirdBannerData()
      return data
  }),

  fourthBanner : publicProcedure.query(async ()=>{
      const data = getFourthBannerData()
      return data
  })


}