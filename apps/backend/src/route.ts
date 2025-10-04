import { authRouter } from "./features/auth/auth.router";
import { bannerRouter } from "./features/banners/banners.routes";
import { businessrouter } from "./features/business/business.router";
import { chatRouter } from "./features/chats/test.routes";
import { cloudinarySignature } from "./features/cloudinary/cloudinarySing.route";
import { setImageUploads } from "./features/cloudinary/imageUploads.route";
import { hirerouter } from "./features/hire/hire.router";
import { testRouter } from "./features/test/test.routes";
import { userRouter } from "./features/user/user.router";
import { router } from "./utils/trpc";

export const appRouter = router({
  auth: authRouter,
  banners: bannerRouter,
  cloudinarySign: cloudinarySignature,
  setImageUploads,
  chatRouter,
  hirerouter,
  test: testRouter,
  userRouter: userRouter,
  businessrouter,
});

export type AppRouter = typeof appRouter;
