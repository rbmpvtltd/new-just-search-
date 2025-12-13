import { adminBannerRouter } from "./dashboard-features/(banners-plan)/banners/banners.admin.routes";
import { adminBusinessRouter } from "./dashboard-features/(business-hire)/business.admin.routes";
import { adminHireRouter } from "./dashboard-features/(business-hire)/hire.admin.routes";
import { adminCategoryRouter } from "./dashboard-features/(category)/category.admin.routes";
import { adminSubcategoryRouter } from "./dashboard-features/(category)/subcategory.admin.routes";
import { adminFranchiseRouter } from "./dashboard-features/(franchise-saleman)/franchise.admin.routes";
import { adminSalemanRouter } from "./dashboard-features/(franchise-saleman)/saleman.admin.routes";
import { adminOfferRouter } from "./dashboard-features/(offer-product)/offer.admin.routes";
import { adminProductRouter } from "./dashboard-features/(offer-product)/product.admin.routes";
import { adminDeleteRequestRouter } from "./dashboard-features/(users)/deleteRequest.admin.routes";
import { adminFeedbackRouter } from "./dashboard-features/(users)/feedback.admin.routes";
import { adminNotificationRouter } from "./dashboard-features/(users)/notification.admin.routes";
import { adminUsersRouter } from "./dashboard-features/(users)/users.admin.routes";
import { adminUtilsRouter } from "./dashboard-features/utils/util.admin.routes";

import { authRouter } from "./features/auth/auth.router";
import { bannerRouter } from "./features/banners/banners.routes";
import { businessrouter } from "./features/business/business.router";
import { chatRouter } from "./features/chat/chat.routes";
import { cloudinarySignature } from "./features/cloudinary/cloudinary.route";
import { helpAndSupportRouter } from "./features/helpAndSupport/helpAndSupport.route";
import { hirerouter } from "./features/hire/hire.router";
import { categoryRouter } from "./features/mainContent/category.route";
import { offerrouter } from "./features/offer/offer.router";
import { planRouter } from "./features/plans/plan.router";
import { productrouter } from "./features/product/product.router";
import { utilsRouter } from "./features/routeUtils/utils.route";
import { subcategoryRouter } from "./features/subcategory/subcategory.route";
import { testRouter } from "./features/test/test.routes";
import { userRouter } from "./features/user/user.router";
import { mergeRouters, router } from "./utils/trpc";

const usersRouter = router({
  auth: authRouter,
  banners: bannerRouter,
  cloudinarySignature,
  hirerouter,
  chat: chatRouter,
  userRouter: userRouter,
  businessrouter,
  categoryRouter,
  subcategoryRouter,
  offerrouter,
  productrouter,
  helpAndSupportRouter,
  testRouter,
  planRouter,
  utilsRouter,
});

const adminRouter = router({
  adminBannerRouter,
  adminCategoryRouter,
  adminSubcategoryRouter,
  adminBusinessRouter,
  adminHireRouter,
  adminUsersRouter,
  adminDeleteRequestRouter,
  adminFeedbackRouter,
  adminNotificationRouter,
  adminSalemanRouter,
  adminFranchiseRouter,
  adminOfferRouter,
  adminProductRouter,
  adminUtilsRouter,
});

export const appRouter = mergeRouters(usersRouter, adminRouter);

export type AppRouter = typeof appRouter;
