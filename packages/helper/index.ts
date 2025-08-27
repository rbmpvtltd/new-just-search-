import winston from "winston";
import fs from "fs";
import path from "path";
import { error, time } from "console";

const logDir = path.resolve(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    }),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          ({ level, message, timestamp }) =>
            `[${timestamp}] ${level}: ${message}`,
        ),
      ),
    }),

    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),

    new winston.transports.File({
      filename: path.join(logDir, "info.log"),
      level: "info",
    }),

    new winston.transports.File({
      filename: path.join(logDir, "combine.log"),
    }),
  ],
});

// export const log = {
//   error: (msg: string) => logger.error(msg),
//   warn: (msg: string) => logger.warn(msg),
//   info: (msg: string) => logger.info(msg),
//   debug: (msg: string) => logger.info(msg),
// };

export { logger };
