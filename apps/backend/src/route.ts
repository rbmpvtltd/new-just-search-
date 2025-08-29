import { authRouter } from "./features/auth/auth.router";
import { publicProcedure, router } from "./utils/trpc";

export const appRouter = router({
  auth: authRouter,
  hi: publicProcedure.query(() => {
    return "hi";
  }),
});

export type AppRouter = typeof appRouter;
