import { authRouter } from "./features/auth/auth.router";
import { adminBannerRouter } from "./features/banners/banners.admin.routes";
import { bannerRouter } from "./features/banners/banners.routes";
import { chatRouter } from "./features/chats/test.routes";
import { cloudinarySignature } from "./features/cloudinary/cloudinarySing.route";
import { setImageUploads } from "./features/cloudinary/imageUploads.route";
import { hirerouter } from "./features/hire/hire.router";
import { testRouter } from "./features/test/test.routes";
import { router } from "./utils/trpc";

export const appRouter = router({
  auth: authRouter,
  banners: bannerRouter,
  adminBanner: adminBannerRouter,
  cloudinarySign: cloudinarySignature,
  setImageUploads,
  chatRouter,
  hirerouter,
  test: testRouter,
});

export type AppRouter = typeof appRouter;
