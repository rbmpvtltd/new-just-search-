import { db } from "@repo/db";
import { PlanPeriod } from "@repo/db/dist/enum/allEnum.enum";
import {
  planAttributes,
  plans,
  plansInsertSchema,
} from "@repo/db/dist/schema/plan.schema";
import { eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import z from "zod";
import { adminProcedure, protectedProcedure, router } from "@/utils/trpc";

// import { razorpayInstance } from "./plan.service";

z.object({
  name: z.string(),
  amount: z.number(),
  currency: z.string().default("INR"),
  description: z.string(),
  interval: z.number(),
  // period: z.enum(PlanPeriod),
});
export const planRouter = router({
  list: protectedProcedure.query(async () => {
    const data = await db
      .select({
        id: plans.id,
        title: plans.name,
        attribute: sql<{ name: string; isAvailable: boolean }[]>`
      COALESCE(
        json_agg(
          json_build_object(
            'name', ${planAttributes.name},
            'isAvailable', ${planAttributes.isAvailable}
          )
        ) FILTER (WHERE ${planAttributes.id} IS NOT NULL),
        '[]'
      )
    `,
        role: plans.role,
        amount: plans.amount,
        currency: plans.currency,
        planColor: plans.planColor,
        status: plans.status,
        features: plans.features,
        identifier: plans.identifier,
        createdAt: plans.createdAt,
        updatedAt: plans.updatedAt,
      })
      .from(plans)
      .leftJoin(planAttributes, eq(plans.id, planAttributes.planId))
      .groupBy(plans.id);

    return data;
  }),
  createPlan: adminProcedure
    .input(
      plansInsertSchema.extend({
        name: z.string(),
        amount: z.number(),
        currency: z.string().default("INR"),
        description: z.string(),
        interval: z.number(),
        // period: z.enum(PlanPeriod),
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
  // createSusbription: adminProcedure
  //   .input(z.object(planId: z.string(), userId: z.number() ))
  //   .mutation(async (input ) => {
  //     const { planId } = input;
  //     // TODO: uncommit this It was commited to avoid temp error
  //     // const response = await razorpayInstance.subscriptions.create({
  //     //   plan_id: planId,
  //     //   customer_notify: 1,
  //     //   total_count: 1,
  //     //   // customer_id: userId,
  //     // });
  //     // console.log(response);
  //   }),
});
