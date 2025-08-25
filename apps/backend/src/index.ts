import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import { appRouter } from "./route";
import { createContext } from "./utils/trpc";

const app = express();
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.get("/panel", (_, res) => {
  if (process.env.NODE_ENV !== "development") {
    return res.status(404).send("Not Found");
  }

  const {renderTrpcPanel} = await import "trpc-ui"

  return res.send(
    renderTrpcPanel(appRouter, {
      url: "http://localhost:4000/trpc", // Base url of your trpc server
      meta: {
        title: "My Backend Title",
        description:
          "This is a description of my API, which supports [markdown](https://en.wikipedia.org/wiki/Markdown).",
      },
    }),
  );
});

app.listen(4000);
