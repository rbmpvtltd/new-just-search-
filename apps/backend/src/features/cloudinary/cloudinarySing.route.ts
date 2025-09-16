import { protectedProcedure, router } from "@/utils/trpc";
import { cloudinary } from "@repo/helper";
import z from "zod";

export const cloudinarySignature = router({
    uploadImage : protectedProcedure.input(z.object({
        paramsToSign : z.object({
            timestamp : z.number(),
            source : z.string()
        })
    })).mutation(async ({input})=>{
        const {paramsToSign} = input;
        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            "g1XUaqg9Y2b78dkuca5RFvrz75I"
        )

        return {
            signature
        }
    })
})