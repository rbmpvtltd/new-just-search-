// packages/helper/logger.ts
import fs from "fs";
import path from "path";
import winston from "winston";

const {
  combine,
  timestamp,
  json,
  errors,
  splat,
  colorize,
  simple,
  prettyPrint,
} = winston.format;

const logDir = path.resolve(process.cwd(), "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

export const logger = winston.createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    splat(),
    json(),
    prettyPrint(),
  ),
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: combine(colorize(), simple()),
    }),
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logDir, "info.log"),
      level: "info",
    }),
    new winston.transports.File({ filename: path.join(logDir, "combine.log") }),
  ],
});

export default logger;
