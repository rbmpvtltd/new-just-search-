import { cloudinary } from "@repo/cloudinary";
import type express from "express";
import env from "@/utils/envaild";

export const cloudinarySignature = async (
  req: express.Request,
  res: express.Response,
) => {
  const body = req.body;

  const { paramsToSign } = body;

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    env.CLOUDINARY_API_SECRET,
  );

  return res.json({
    signature,
  });
};

export const cloudinaryDeleteImageByPublicId = async (public_id: string) => {
  await cloudinary.uploader.destroy(public_id);
};
export const cloudinaryDeleteImagesByPublicIds = async (
  public_ids: string[],
) => {
  console.log("Public", public_ids);

  await cloudinary.api.delete_resources(public_ids);
};
