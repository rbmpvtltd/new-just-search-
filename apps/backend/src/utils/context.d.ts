import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
export declare const createContext: ({ req, res }: CreateExpressContextOptions) => {
    token: string | undefined;
};
export type Context = Awaited<ReturnType<typeof createContext>>;
//# sourceMappingURL=context.d.ts.map