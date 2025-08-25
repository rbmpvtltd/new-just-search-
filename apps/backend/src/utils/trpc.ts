import { initTRPC, TRPCError } from "@trpc/server";

export const createContext = () => ({
  user: {
    id: 1,
    isAdmin: true,
  },
});

type Context = Awaited<ReturnType<typeof createContext>>;

export const t = initTRPC.context<Context>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

export const adminProcedure = publicProcedure.use(async (opts) => {
  const { ctx } = opts;

  if (!ctx.user?.isAdmin) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return opts.next({
    ctx: {
      user: ctx.user,
    },
  });
});
