import { OpenAPIGenerator } from "@orpc/openapi";
import { OpenAPIHandler } from "@orpc/openapi/node";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { toORPCRouter } from "@orpc/trpc";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { appRouter } from "@/route";

const orpcRouter = toORPCRouter(appRouter);

const openAPIGenerator = new OpenAPIGenerator({
  schemaConverters: [
    new ZodToJsonSchemaConverter(), // <-- if you use Zod
  ],
});

export const ORPCspec = await openAPIGenerator.generate(orpcRouter, {
  info: {
    title: "My App",
    version: "0.0.0",
  },
});

export const ORPChandler = new OpenAPIHandler(orpcRouter, {
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
