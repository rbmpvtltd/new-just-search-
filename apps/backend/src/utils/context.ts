import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";

export const createContext = ({ req, res }: CreateExpressContextOptions) => {
  const token = req.headers.authorization?.split(" ")[1];
  return {
    token,
  };
};

export const createWSContext = (opts: CreateWSSContextFnOptions) => {
  const token = opts.req.headers["authorization"]?.split(" ")[1];
  return { token };
};


export type Context = Awaited<ReturnType<typeof createContext>>;
