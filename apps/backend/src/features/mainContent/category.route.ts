import { publicProcedure,router } from "@/utils/trpc";
import { getAllCategories, getPopularBannerCategory, getPopularCategories } from "./category.service";

export const categoryRouter = router({
    popularCategories : publicProcedure.query(async ()=>{
        const data = getPopularCategories();
        return data
    }),
    allCategories : publicProcedure.query(async ()=>{
        const data = getAllCategories();
        return data
    }),

    popularBannerCategory : publicProcedure.query(async ()=>{
        const data = getPopularBannerCategory();
        return data 
    })
})