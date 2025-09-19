import { cloudinary } from "@repo/helper";
import type express from "express";
import env from "@/utils/envaild"; // Typo? Should probably be "env" or "envValid"?

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
