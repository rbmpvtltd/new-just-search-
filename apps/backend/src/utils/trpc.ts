import type { ORPCMeta } from "@orpc/trpc";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { validateSessionToken } from "@/features/auth/lib/session";
import type { Context } from "./context";
import { logger } from "@repo/helper";

export const t = initTRPC.context<Context>().meta<ORPCMeta>().create({
  transformer: superjson,
});

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = publicProcedure.use(async (opts) => {
  const { ctx } = opts;

  if (!ctx.token) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "cannot find token" });
  }

  const session = await validateSessionToken(ctx.token);
  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "token is not valid",
    });
  }

  return opts.next({
    ctx: {
      userId: session.userId,
      role: session.role,
      sessionId: session.id,
    },
  });
});

export const visitorProcedure = protectedProcedure.use(async (opts) => {
  const { ctx } = opts;
  if (
    ctx.role === "visiter" ||
    ctx.role === "hire" ||
    ctx.role === "business"
  ) {
    return opts.next();
  }
  throw new TRPCError({
    code: "UNAUTHORIZED",
    message: "please verify",
  });
});

export const businessProcedure = protectedProcedure.use(async (opts) => {
  const { ctx } = opts;
  if (ctx.role === "business") {
    return opts.next();
  }
  throw new TRPCError({
    code: "UNAUTHORIZED",
    message: "please verify",
  });
});

export const hireProcedure = protectedProcedure.use(async (opts) => {
  const { ctx } = opts;
  if (ctx.role === "hire") {
    return opts.next();
  }
  throw new TRPCError({
    code: "UNAUTHORIZED",
    message: "please verify",
  });
});
export const salemanProcedure = protectedProcedure.use(async (opts) => {
  const { ctx } = opts;

  if (
    ctx.role === "salesman" ||
    ctx.role === "franchises" ||
    ctx.role === "admin"
  ) {
    return opts.next();
  }
  throw new TRPCError({
    code: "UNAUTHORIZED",
    message: "please verify",
  });
});
export const franchisesProcedure = protectedProcedure.use(async (opts) => {
  const { ctx } = opts;

  if (ctx.role === "franchises" || ctx.role === "admin") {
    return opts.next();
  }
  throw new TRPCError({
    code: "UNAUTHORIZED",
    message: "please verify",
  });
});
export const adminProcedure = protectedProcedure.use(async (opts) => {
  const { ctx } = opts;

  if (ctx.role === "admin") {
    return opts.next();
  }
  throw new TRPCError({
    code: "UNAUTHORIZED",
    message: "please verify",
  });
});
