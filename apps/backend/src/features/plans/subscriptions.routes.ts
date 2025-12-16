// features/banners/banners.admin.routes.ts

import { db } from "@repo/db";
import {
  banners,
  bannerUpdateSchema,
} from "@repo/db/dist/schema/not-related.schema";
import { logger } from "@repo/logger";
import { TRPCError } from "@trpc/server";
import { eq, inArray, sql } from "drizzle-orm";
import z from "zod";
import {
  cloudinaryDeleteImageByPublicId,
  cloudinaryDeleteImagesByPublicIds,
} from "@/lib/cloudinary";
import { razorpayInstance } from "@/lib/razorpay";
import { adminProcedure, protectedProcedure, router } from "@/utils/trpc";

export const subscriptionRouter = router({
  create: protectedProcedure
    .input(z.object({ identifier: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const response = await razorpayInstance.subscriptions.create({
        plan_id: input.identifier,
        customer_notify: 1,
        total_count: 1,
        // customer_id: userId,
      });
      console.log(response);
      // await db.insert(planUserActive).values({
      //   userId: ctx.userId,
      //   planId: response.plan_id,
      // })
      return { success: true, response: response };
    }),
  edit: adminProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const data = await db
        .select()
        .from(banners)
        .where(eq(banners.id, input.id));
      return data[0];
    }),
  update: adminProcedure
    .input(bannerUpdateSchema)
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      logger.info("getting in backend");
      if (!id)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please pass id field",
        });
      const olddata = (
        await db.select().from(banners).where(eq(banners.id, id))
      )[0];
      if (olddata?.photo && olddata?.photo !== updateData.photo) {
        await cloudinaryDeleteImageByPublicId(olddata.photo);
      }
      await db.update(banners).set(updateData).where(eq(banners.id, id));
      return { success: true };
    }),
  multidelete: adminProcedure
    .input(
      z.object({
        ids: z.array(z.number()),
      }),
    )
    .mutation(async ({ input }) => {
      const allSeletedPhoto = await db
        .select({
          photo: banners.photo,
        })
        .from(banners)
        .where(inArray(banners.id, input.ids));
      await cloudinaryDeleteImagesByPublicIds(
        allSeletedPhoto.map((item) => item.photo),
      );
      await db.delete(banners).where(inArray(banners.id, input.ids));
      return { success: true };
    }),
  multiactive: adminProcedure
    .input(
      z.array(
        z.object({
          id: z.number(),
          isActive: z.boolean(),
        }),
      ),
    )
    .mutation(async ({ input }) => {
      await db
        .update(banners)
        .set({
          isActive: sql`CASE ${banners.id} 
            ${sql.join(
              input.map(
                (item) =>
                  sql`WHEN ${item.id} THEN ${item.isActive ? sql`true` : sql`false`}`,
              ),
              sql` `,
            )} 
                ELSE ${banners.isActive} 
                END`,
        })
        .where(
          inArray(
            banners.id,
            input.map((item) => item.id),
          ),
        );

      return { success: true };
    }),
});
