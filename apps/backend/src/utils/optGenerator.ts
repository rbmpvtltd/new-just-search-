import { redis } from "@/lib/redis";
import { logger } from "@repo/logger";
import { isEmail } from "./identifier";
import { sendEmailOTP, sendSMSViaFast2SMSDLT } from "./sendOtp";
import { success } from "zod";

function otpGenerator() {
  return Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
}

export const sendSMSOTP = async (identifier: string) => {
  const otp = otpGenerator();

  logger.info("otp is", {
    otp,
    "phoneNumber is ": identifier,
  });

  redis.set(`otpsession:${identifier}`, otp, "EX", 60 * 20); // TODO: set short life time for expiry otp

  if (isEmail(identifier)) {
    await sendEmailOTP(identifier, otp);
    return { success: true, method: "email" };
  } else {
    // implement fast to sms when identifier is number
    await sendSMSViaFast2SMSDLT(identifier, otp);
    return { success: true, method: "sms" };
  }
};
