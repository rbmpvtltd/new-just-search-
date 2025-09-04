import { authRouter } from "./features/auth/auth.router";
import { bannerRouter } from "./features/banners/banners.routes";
import { publicProcedure, router } from "./utils/trpc";
// import { getFirstBannerData } from "./features/banners/banners.service";

// export const bannerRouter = router({
//   first: publicProcedure.query(async () => {
//     const data = getFirstBannerData();
//     return data;
//   }),
// });

// export const bannerRouter = router({
//   first: publicProcedure.query(async () => {
//     const data = getFirstBannerData();
//     return data;
//   }),
// });

export const appRouter = router({
  auth: authRouter,
  banners: bannerRouter,
  hi: router({
    hi2: publicProcedure.query(() => {
      return {
        itemid: 1,
        about: "hi",
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
