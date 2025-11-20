import { redis } from "@/lib/redis";
import { logger } from "@repo/logger";

export async function verifyOTP(
  identifier: string,
  otp: string
): Promise<boolean> {
  const storedOTP = await redis.get(`otpsession:${identifier}`);

  if (!storedOTP) {
    logger.warn("OTP not found or expired", { identifier });
    return false;
  }

  if (storedOTP !== otp) {
    logger.warn("Invalid OTP provided", { identifier });
    return false;
  }

  // OTP is valid, delete it from Redis
  await redis.del(`otpsession:${identifier}`);
  logger.info("OTP verified successfully", { identifier });

  return true;
}
