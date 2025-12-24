import express from "express";
import { adminBusinessRouter } from "./dashboard-features/(business-hire)/business.admin.routes";
import { adminHireRouter } from "./dashboard-features/(business-hire)/hire.admin.routes";
import { adminCategoryRouter } from "./dashboard-features/(category)/category.admin.routes";
import { adminSubcategoryRouter } from "./dashboard-features/(category)/subcategory.admin.routes";
import { adminFranchiseRouter } from "./dashboard-features/(franchise-saleman)/franchise.admin.routes";
import { adminSalemanRouter } from "./dashboard-features/(franchise-saleman)/salesman.admin.routes";
import { franchiseSalemanRouter } from "./dashboard-features/(franchise-saleman)/salesman.franchise.routes";
import { salesmanUserRouter } from "./dashboard-features/(franchise-saleman)/user.salesman.routes";
import { adminOfferRouter } from "./dashboard-features/(offer-product)/offer.admin.routes";
import { adminProductRouter } from "./dashboard-features/(offer-product)/product.admin.routes";
import { adminDeleteRequestRouter } from "./dashboard-features/(users)/deleteRequest.admin.routes";
import { adminFeedbackRouter } from "./dashboard-features/(users)/feedback.admin.routes";
import { adminHelpAndSupportRouter } from "./dashboard-features/(users)/help-and-support.admin.routes";
import { adminNotificationRouter } from "./dashboard-features/(users)/notification.admin.routes";
import { adminUsersRouter } from "./dashboard-features/(users)/users.admin.routes";
import { adminBannerRouter } from "./dashboard-features/banners/banners.admin.routes";
import { adminAttributesRouter } from "./dashboard-features/plan/attibutes.admin.routes";
import { adminPlanRouter } from "./dashboard-features/plan/plan.admin.routes";
import { revenueCatRouter } from "./dashboard-features/plan/webhooks/revenue-cat.routes";
import { adminUtilsRouter } from "./dashboard-features/utils/util.admin.routes";
import { authRouter } from "./features/auth/auth.router";
import { bannerRouter } from "./features/banners/banners.routes";
import { businessrouter } from "./features/business/business.router";
import { categoryRouter } from "./features/category/category.route";
import { chatRouter } from "./features/chat/chat.routes";
import { cloudinarySignature } from "./features/cloudinary/cloudinary.route";
import { helpAndSupportRouter } from "./features/helpAndSupport/helpAndSupport.route";
import { hirerouter } from "./features/hire/hire.router";
import { notificationRouter } from "./features/notification/notification.router";
import { offerrouter } from "./features/offer/offer.router";
import { planRouter } from "./features/plans/plan.router";
import { subscriptionRouter } from "./features/plans/subscriptions.routes";
import { productrouter } from "./features/product/product.router";
import { utilsRouter } from "./features/routeUtils/utils.route";
import { subcategoryRouter } from "./features/subcategory/subcategory.route";
import { testRouter } from "./features/test/test.routes";
import { userRouter } from "./features/user/user.router";
import { versionRouter } from "./features/version/version.routes";
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
  subscriptionRouter,
  notificationRouter,
  versionRouter,
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
  adminPlanRouter,
  adminProductRouter,
  adminUtilsRouter,
  adminHelpAndSupportRouter,
  adminAttributesRouter,
  franchiseSalemanRouter,
  salesmanUserRouter,
});

const openRouter = express.Router();
openRouter.post("/revenue", revenueCatRouter);

export { openRouter };
export const appRouter = mergeRouters(usersRouter, adminRouter);
export type AppRouter = typeof appRouter;
