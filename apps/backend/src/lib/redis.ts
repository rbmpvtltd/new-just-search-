import { Redis } from "ioredis";
import env from "@/utils/envaild";

export const redis = new Redis({
  port: env.REDIS_PORT,
  host: env.REDIS_HOST,
  username: env.REDIS_USERNAME,
  password: env.REDIS_PASSWORD,
});
