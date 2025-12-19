import type { ORPCMeta } from "@orpc/trpc";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
// import { ZodError } from "zod";
import { validateSessionToken } from "@/features/auth/lib/session";
import type { Context } from "./context";

export const t = initTRPC.context<Context>().meta<ORPCMeta>().create({
  transformer: superjson,
  // errorFormatter(opts) {
  //   const { shape, error } = opts;
  //   return {
  //     ...shape,
  //     data: {
  //       ...shape.data,
  //       zodError:
  //         error.code === "BAD_REQUEST" && error.cause instanceof ZodError
  //           ? error.cause.message
  //           : null,
  //     },
  //   };
  // },
});

export const tOpen = initTRPC.create();
export const openRouter = tOpen.router;
export const router = t.router;
export const mergeRouters = t.mergeRouters;

export const publicProcedure = t.procedure;
export const openProcedure = tOpen.procedure;

export const guestProcedure = publicProcedure.use(async (opts) => {
  const { ctx } = opts;

  if (!ctx.token) {
    return opts.next({
      ctx: {
        userId: null,
        role: "guest",
      },
    });
  }

  const session = await validateSessionToken(ctx.token);
  if (!session) {
    return opts.next({
      ctx: {
        userId: null,
        role: "guest",
      },
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
    ctx.role === "business" ||
    ctx.role === "admin"
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
  if (ctx.role === "business" || ctx.role === "admin") {
    return opts.next();
  }
  throw new TRPCError({
    code: "UNAUTHORIZED",
    message: "please verify",
    cause: 401,
  });
});

export const hireProcedure = protectedProcedure.use(async (opts) => {
  const { ctx } = opts;
  if (ctx.role === "hire" || ctx.role === "admin") {
    return opts.next();
  }
  throw new TRPCError({
    code: "UNAUTHORIZED",
    message: "please verify",
  });
});
export const salesmanProcedure = protectedProcedure.use(async (opts) => {
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
