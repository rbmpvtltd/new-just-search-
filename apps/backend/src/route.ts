import { authRouter } from "./features/auth/auth.router";
import { bannerRouter } from "./features/banners/banners.routes";
import { chatRouter } from "./features/chats/test.routes";
import { cloudinarySignature } from "./features/cloudinary/cloudinarySing.route";
import { setImageUploads } from "./features/cloudinary/imageUploads.route";
import { hirerouter } from "./features/hire/hire.router";
import { testRouter } from "./features/test/test.routes";
import { categoryRouter } from "./features/mainContent/category.route";
// import { cloudinaryRouter } from "./lib/cloudinary";
import { router } from "./utils/trpc";
import { subcategoryRouter } from "./features/subcategory/subcategory.route";

export const appRouter = router({
  auth: authRouter,
  banners: bannerRouter,
  cloudinarySign: cloudinarySignature,
  setImageUploads,
  chatRouter,
  hirerouter,
  test: testRouter,
  categoryRouter,
  subcategoryRouter
  // cloudinary: cloudinaryRouter,
  // test: testRouter,
  // test : chatRouter,
});

export type AppRouter = typeof appRouter;
