import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export const createContext = ({ req, res }: CreateExpressContextOptions) => {
  const token = req.headers.authorization?.split(" ")[1];
  return {
    token,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
