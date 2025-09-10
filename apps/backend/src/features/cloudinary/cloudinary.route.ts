import { z } from "zod";
import { cloudinary } from "@repo/helper";
import { router, protectedProcedure } from "@/utils/trpc";
import dotenv from "dotenv";

dotenv.config();

export const cloudinaryRouter = router({
  getSignature: protectedProcedure
    .input(
      z.object({
        folder: z.enum(["banner", "avatar", "document"]),
      }),
    )
    .query(({ input, ctx }) => {
      const timestamp = Math.round(new Date().getTime() / 1000);

      const expiration = timestamp + 300;

      const params = {
        timestamp,
        expiration,
        folder: input.folder,
        tags: [`user_${ctx.userId}`],
      };

      const signature = cloudinary.utils.api_sign_request(
        params,
        process.env.CLOUDINARY_API_SECRET || "",
      );

      return {
        signature,
        timestamp,
        expiration,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_CLOUD_NAME,
        folder: params.folder,
      };
    }),
});
