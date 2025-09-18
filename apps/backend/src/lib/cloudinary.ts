import { cloudinary, log } from "@repo/helper";
import { TRPCError } from "@trpc/server";
import type express from "express";
import { validateSessionToken } from "@/features/auth/lib/session";
import env from "@/utils/envaild"; // Typo? Should probably be "env" or "envValid"?

export const cloudinarySignature = async (
  req: express.Request,
  res: express.Response,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "cannot find token" });
  }

  const validateToken = await validateSessionToken(token);
  if (!validateToken) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "token is not valid",
    });
  }

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
