import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";

export const createContext = ({ req, info }: CreateExpressContextOptions) => {
  const token = req.headers.authorization?.split(" ")[1];
  const subscriptionToken = info.connectionParams?.authorization?.split(" ")[1];
  return {
    token: token || subscriptionToken,
  };
};

export const createWSContext = (opts: CreateWSSContextFnOptions) => {
  const token = opts.req.headers["authorization"]?.split(" ")[1];
  return { token };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
