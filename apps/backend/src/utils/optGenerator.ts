import { logger } from "@repo/helper";

export const sendSMSOTP = (phoneNumber: string) => {
  // WARN: add real otp generator
  const otp = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");

  logger.info("otp is", otp, "phoneNumber is ", phoneNumber);
};
