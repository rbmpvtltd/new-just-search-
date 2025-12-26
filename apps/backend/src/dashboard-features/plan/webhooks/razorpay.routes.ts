// import EventEmitter from "node:events";
// import type { NextFunction, Request, RequestHandler, Response } from "express";
// import { subscriptionCaller } from "@/features/plans/subscriptions.routes";
//
// export const TestEvent = new EventEmitter();
// export const asyncHandler =
//   (
//     fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
//   ): RequestHandler =>
//   (req, res, next) => {
//     Promise.resolve(fn(req, res, next)).catch(next);
//   };
//
// export const testEvent = asyncHandler(async (_: Request, res: Response) => {
//   subscriptionCaller.sendEvent();
//   return res.send("revenueCatRouter");
// });
