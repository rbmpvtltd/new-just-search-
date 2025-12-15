import { PlanPeriod } from "@repo/db/dist/enum/allEnum.enum";
import { plansInsertSchema } from "@repo/db/dist/schema/plan.schema";
import z from "zod";
import { adminProcedure, router } from "@/utils/trpc";

// import { razorpayInstance } from "./plan.service";

z.object({
  name: z.string(),
  amount: z.number(),
  currency: z.string().default("INR"),
  description: z.string(),
  interval: z.number(),
  period: z.enum(PlanPeriod),
});
export const planRouter = router({
  createPlan: adminProcedure
    .input(
      plansInsertSchema.extend({
        name: z.string(),
        amount: z.number(),
        currency: z.string().default("INR"),
        description: z.string(),
        interval: z.number(),
        period: z.enum(PlanPeriod),
      }),
    )
    .mutation(async ({ input }) => {
      // TODO: uncommit this It was commited to avoid temp error
      // const response = await razorpayInstance.plans.create({
      //   period: input.period,
      //   interval: input.interval,
      //   item: {
      //     name: input.name,
      //     amount: input.amount,
      //     currency: input.currency,
      //     description: input.description,
      //   },
      // });
      // console.log(response);
      // const dbData = plansInsertSchema
      //   .omit({
      //     identifier: true,
      //   })
      //   .extend({
      //     period: z.enum(PlanPeriod),
      //     role: z.enum(UserRole),
      //   })
      //   .parse(input);
      //
      // await db.insert(plans).values({
      //   ...dbData,
      //   identifier: response.id,
      // });
      // return;
    }),
  createSusbription: adminProcedure
    .input(z.object({ planId: z.string(), userId: z.number() }))
    .mutation(async ({ input }) => {
      const { planId } = input;
      // TODO: uncommit this It was commited to avoid temp error
      // const response = await razorpayInstance.subscriptions.create({
      //   plan_id: planId,
      //   customer_notify: 1,
      //   total_count: 1,
      //   // customer_id: userId,
      // });
      // console.log(response);
    }),
});
