import { authRouter } from "./features/auth/auth.router";
import { bannerRouter } from "./features/banners/banners.routes";
import { publicProcedure, router } from "./utils/trpc";

export const appRouter = router({
  auth: authRouter,
  banners: bannerRouter,
  hi: publicProcedure.query(() => {
    return "hi";
  }),
});

export type AppRouter = typeof appRouter;
