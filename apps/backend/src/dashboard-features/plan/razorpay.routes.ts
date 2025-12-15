import { openProcedure, openRouter } from "@/utils/trpc";

export const razorpayRouter = openRouter({
  webhooks: openProcedure.mutation(async () => {
    console.log("razorpay");
    return { success: true, message: "razorpay2" };
  }),
});
