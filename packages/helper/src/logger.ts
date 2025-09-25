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

const logger = winston.createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }), // handle Error objects
    splat(), // support multiple args
    json(), // serialize objects
    prettyPrint(),
  ),
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: combine(
        colorize(),
        simple(), // readable console output
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
    new winston.transports.File({ filename: path.join(logDir, "combine.log") }),
  ],
});
logger.info("Logger initialized", { dir: logDir, data: { adahd: "adahd" } });
export { logger };
