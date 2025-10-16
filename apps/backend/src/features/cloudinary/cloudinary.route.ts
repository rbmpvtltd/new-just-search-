import { cloudinary } from "@repo/cloudinary";
import { env } from "@repo/helper";
import z from "zod";
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
    .mutation(async ({ input }) => {
      const { paramsToSign } = input;

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
        tags: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const timestamp = Math.round(Date.now() / 1000);
      const newTag = `${ctx.userId},${input.tags}`;

      const signature = cloudinary.utils.api_sign_request(
        {
          timestamp: timestamp,
          eager: input.eager,
          folder: input.folder,
          tags: newTag,
        },
        env.CLOUDINARY_API_SECRET,
      );

      return {
        timestamp,
        signature,
        cloudname: env.CLOUDINARY_CLOUD_NAME,
        apikey: env.CLOUDINARY_API_KEY,
        tags: newTag,
      };
    }),
});
