import { log } from "@repo/helper";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";
import { cloudinarySignature } from "./lib/cloudinary";
import { ORPChandler, ORPCspec } from "./lib/orpc";
import { appRouter } from "./route";
import { createContext } from "./utils/context";

const app = express();

app.use(cors({ origin: "*" }));

// adding trpc
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
    onError: (opts) => {
      log.error(opts.error.code);
    },
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post("/v1/api/sign-image", cloudinarySignature);

// adding websocket in trpc

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

// listening on localhost:4000
app.listen(4000);

// exporting ---
export type { AppRouter } from "./route";
export { appRouter };
