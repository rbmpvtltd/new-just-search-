import { authRouter } from "./features/auth/auth.router";
import { adminBannerRouter } from "./features/banners/banners.admin.routes";
import { bannerRouter } from "./features/banners/banners.routes";
import { businessrouter } from "./features/business/business.router";
import { chatRouter } from "./features/chats/test.routes";
import { cloudinarySignature } from "./features/cloudinary/cloudinary.route";
import { hirerouter } from "./features/hire/hire.router";
import { categoryRouter } from "./features/mainContent/category.route";
import { subcategoryRouter } from "./features/subcategory/subcategory.route";
import { testRouter } from "./features/test/test.routes";
import { userRouter } from "./features/user/user.router";
// import { cloudinaryRouter } from "./lib/cloudinary";
import { router } from "./utils/trpc";

export const appRouter = router({
  auth: authRouter,
  banners: bannerRouter,
  adminBanner: adminBannerRouter,
  cloudinarySignature,
  chatRouter,
  hirerouter,
  test: testRouter,
  userRouter: userRouter,
  businessrouter,
  categoryRouter,
  subcategoryRouter,
  // cloudinary: cloudinaryRouter,
  // test: testRouter,
  // test : chatRouter,
});

export type AppRouter = typeof appRouter;
