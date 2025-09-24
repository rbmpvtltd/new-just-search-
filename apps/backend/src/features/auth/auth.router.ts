import { TRPCError } from "@trpc/server";
import z from "zod";
import { protectedProcedure, publicProcedure, router } from "@/utils/trpc";
import { checkUserPassword } from "./auth.service";
import { createSession } from "./lib/session";

export const authRouter = router({
	login: publicProcedure
		.input(z.object({ email: z.string().email(), password: z.string().min(6) }))
		.mutation(async ({ input }) => {
			const isCredentialCorrect = checkUserPassword(
				input.email,
				input.password,
			);

			if (!isCredentialCorrect) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "your credential is not correct",
				});
			}
			const session = await createSession(isCredentialCorrect.userId);
			return session?.token;
		}),
	verifyauth: protectedProcedure.query(async () => {
		return { success: true };
	}),
	logout: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.userId;
		return userId;
	}),
});

export type AuthRouter = typeof authRouter;
