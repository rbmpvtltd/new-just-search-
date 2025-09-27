import { db } from "@repo/db";
import { hireProcedure, router } from "@/utils/trpc";

export const hirerouter = router({
  addhire: hireProcedure.query(async ({ ctx }) => {
    const user = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.id, ctx.userId),
    });
    return user;
  }),
});
