import { cloudinary } from "@repo/cloudinary";
import { env } from "@repo/helper";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { canUploadImage } from "@/utils/cloudinaryCount";
import { protectedProcedure, router } from "@/utils/trpc";

export const cloudinarySignature = router({
  signUploadWidget: protectedProcedure
    .input(
      z.object({
        paramsToSign: z.object({
          timestamp: z.number(),
          source: z.string(),
        }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.userId;
      const { paramsToSign } = input;
      const isAllowed = await canUploadImage(userId);

      if (!isAllowed) {
        throw new TRPCError({
          code: "CLIENT_CLOSED_REQUEST",
          message: "You Just Allowed To Uploads Images",
        });
      }

      const signature = cloudinary.utils.api_sign_request(
        paramsToSign,
        env.CLOUDINARY_API_SECRET,
      );

      return {
        signature,
      };
    }),
  signUploadForm: protectedProcedure
    .input(
      z.object({
        eager: z.string(),
        folder: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const isAllowed = await canUploadImage(ctx.userId);

      if (!isAllowed) {
        throw new TRPCError({
          code: "CLIENT_CLOSED_REQUEST",
          message: "You Just Allowed To Uploads Images",
        });
      }
      const timestamp = Math.round(Date.now() / 1000);

      const signature = cloudinary.utils.api_sign_request(
        {
          timestamp: timestamp,
          eager: input.eager,
          folder: input.folder,
        },
        env.CLOUDINARY_API_SECRET,
      );

      return {
        timestamp,
        signature,
        cloudname: env.CLOUDINARY_CLOUD_NAME,
        apikey: env.CLOUDINARY_API_KEY,
      };
    }),
});
