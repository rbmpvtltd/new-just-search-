import { protectedProcedure, publicProcedure, router } from "@/utils/trpc";

export const notificationRouter = router({
  getNotification: protectedProcedure.query(async ({ ctx }) => {
    return { success: true, data: ctx };
  }),
});
