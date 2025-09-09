import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { validateSessionToken } from "@/features/auth/lib/session";
import type { Context } from "./context";

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = publicProcedure.use(async (opts) => {
  const { ctx } = opts;

  if (!ctx.token) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "cannot find token" });
  }

  const validateToken = await validateSessionToken(ctx.token);
  if (!validateToken) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "token is not valid",
    });
  }

  return opts.next({
    ctx: {
      userId: validateToken.userId,
    },
  });
});
