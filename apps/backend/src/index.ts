import { OpenAPIGenerator } from "@orpc/openapi";
import { OpenAPIHandler } from "@orpc/openapi/node";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { toORPCRouter } from "@orpc/trpc";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4"; // <-- zod v4
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";
import { appRouter } from "./route";
import { createContext } from "./utils/context";

const app = express();

app.use(cors({ origin: "*" }));

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

const orpcRouter = toORPCRouter(appRouter);

const openAPIGenerator = new OpenAPIGenerator({
  schemaConverters: [
    new ZodToJsonSchemaConverter(), // <-- if you use Zod
  ],
});

const spec = await openAPIGenerator.generate(orpcRouter, {
  info: {
    title: "My App",
    version: "0.0.0",
  },
});

const handler = new OpenAPIHandler(orpcRouter, {
  plugins: [
    new OpenAPIReferencePlugin({
      docsProvider: "scalar",
      docsPath: "/api",
      schemaConverters: [new ZodToJsonSchemaConverter()],
      specGenerateOptions: {
        info: {
          title: "ORPC Playground",
          version: "1.0.0",
        },
      },
    }),
  ],
});

app.use(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  const result = await handler.handle(req, res, {
    context: {
      token,
    },
  });

  if (!result.matched) {
    return next(); // let Express handle 404
  }
});

app.get("/spec", (req, res) => {
  const result = spec;

  res.send(result);
});

app.listen(4000);

export type { AppRouter } from "./route";
export { appRouter };
