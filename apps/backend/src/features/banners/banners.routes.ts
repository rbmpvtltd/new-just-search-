import { publicProcedure, router } from "@/utils/trpc";
import { getBannerData} from "./banners.service";
import z from "zod";

export const bannerRouter = router({
  getBannerData: publicProcedure.input(z.object({type : z.number()})).query(async ({input})=>{
    const data = getBannerData(input.type);
    return data
  }),
});
