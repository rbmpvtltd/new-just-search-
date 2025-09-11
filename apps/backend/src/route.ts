import { authRouter } from "./features/auth/auth.router";
import { bannerRouter } from "./features/banners/banners.routes";
import { cloudinaryRouter } from "./features/cloudinary/cloudinary.route";
import { publicProcedure, router } from "./utils/trpc";

export const appRouter = router({
  auth: authRouter,
  banners: bannerRouter,
  cloudinary: cloudinaryRouter,
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
