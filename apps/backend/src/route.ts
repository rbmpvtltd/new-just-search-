import { authRouter } from "./features/auth/auth.router";
import { bannerRouter } from "./features/banners/banners.routes";
import { testRouter } from "./features/test/test.routes";
import { publicProcedure, router } from "./utils/trpc";
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
  testRouter,
});

export type AppRouter = typeof appRouter;
