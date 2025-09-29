import { cloudinary } from "@repo/cloudinary";
import { env } from "@repo/helper";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { canUploadImage } from "@/utils/cloudinaryCount";
import { protectedProcedure, router } from "@/utils/trpc";

export const cloudinarySignature = router({
  uploadImage: protectedProcedure
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
});
