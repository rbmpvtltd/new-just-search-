import { authRouter } from "./features/auth/auth.router";
import { bannerRouter } from "./features/banners/banners.routes";
import { testRouter } from "./features/test/test.routes";
// import { cloudinaryRouter } from "./lib/cloudinary";
import { router } from "./utils/trpc";

export const appRouter = router({
  auth: authRouter,
  banners: bannerRouter,
  // cloudinary: cloudinaryRouter,
  test: testRouter,
});

export type AppRouter = typeof appRouter;
