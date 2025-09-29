import { setCountUploadImage } from "@/utils/cloudinaryCount";
import { protectedProcedure, router } from "@/utils/trpc";

export const setImageUploads = router({
  test: protectedProcedure.query(async ({ ctx }) => {
    await setCountUploadImage(ctx.userId, 2);
  }),
});
