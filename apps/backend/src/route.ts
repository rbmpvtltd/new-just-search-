import { authRouter } from "./features/auth/auth.router";
import { bannerRouter } from "./features/banners/banners.routes";
import { chatRouter } from "./features/chats/test.routes";
import { cloudinarySignature } from "./features/cloudinary/cloudinarySing.route";
import { setImageUploads } from "./features/cloudinary/imageUploads.route";
import { testRouter } from "./features/test/test.routes";
// import { cloudinaryRouter } from "./lib/cloudinary";
import { router } from "./utils/trpc";

export const appRouter = router({
  auth: authRouter,
  banners: bannerRouter,
  cloudinarySign : cloudinarySignature,
  setImageUploads : setImageUploads,
  chatRouter : chatRouter,
  // cloudinary: cloudinaryRouter,
  // test: testRouter,
  // test : chatRouter,

});

export type AppRouter = typeof appRouter;
