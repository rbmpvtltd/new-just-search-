import { protectedProcedure, router } from "@/utils/trpc";
import { setCountUploadImage } from "@/utils/cloudinaryCount";


export const setImageUploads = router({
    test : protectedProcedure.query(async({ctx})=>{
        await setCountUploadImage(ctx.userId,2)
    })
});
