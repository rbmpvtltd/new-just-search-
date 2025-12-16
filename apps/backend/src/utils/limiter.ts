import { rateLimit } from "express-rate-limit";
import { type RedisReply, RedisStore } from "rate-limit-redis";
import { maxGlobalLimit, minitesGlobalLimit } from "@/constant";
import { redis } from "@/lib/redis";

export const limiter = rateLimit({
  windowMs: minitesGlobalLimit * 60 * 1000,
  max: maxGlobalLimit,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (command: string, ...args: string[]) =>
      redis.call(command, ...args) as Promise<RedisReply>,
  }),
});
