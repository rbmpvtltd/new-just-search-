import { cloudinary } from "@repo/cloudinary";
import { env } from "@repo/helper"; // Typo? Should probably be "env" or "envValid"?
import type express from "express";

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
  await cloudinary.api.delete_resources(public_ids);
};
