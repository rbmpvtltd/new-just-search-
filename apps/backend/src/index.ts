import { logger } from "@repo/helper";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import * as ws from "ws";
import { cloudinarySignature } from "./lib/cloudinary";
import { ORPChandler, ORPCspec } from "./lib/orpc";
import { appRouter } from "./route";
import { createContext, createWSContext } from "./utils/context";

const app = express();

app.use(cors({ origin: "*" }));
app.use(cookieParser());

// adding trpc
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
    middleware: cors({ origin: "*" }),
    onError: (opts) => {
      logger.error(opts.error.code);
    },
  }),
);

// adding websocket in trpc
// const wsServer = new ws.WebSocketServer({ port: 5500 });
// const handler = applyWSSHandler({
//   wss: wsServer,
//   router: appRouter,
//   createContext: createWSContext,
//   keepAlive: {
//     enabled: true,
//     pingMs: 30000,
//     pongWaitMs: 5000,
//   },
// });
//
// wsServer.on("connection", (ws) => {
//   console.log(`connection created`, ws);
//   ws.once("close", () => {
//     console.log(`Connection (${wsServer.clients.size})`);
//   });
// });

// process.on("SIGTERM", () => {
//   handler.broadcastReconnectNotification();
//   wsServer.close();
// });
//
// adding Orpc
//
// get data on localhost:4000/api
app.use(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  const result = await ORPChandler.handle(req, res, {
    context: {
      token,
    },
  });

  if (!result.matched) {
    return next();
  }
});

// get data on localhost:4000/spec
app.get("/spec", (_, res) => {
  const result = ORPCspec;

  res.send(result);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post("/v1/api/sign-image", cloudinarySignature);
app.listen(4000);

// exporting ---
export type { AppRouter } from "./route";
export { appRouter };
