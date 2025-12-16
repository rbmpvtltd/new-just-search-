import { rateLimit } from "express-rate-limit";
import { type RedisReply, RedisStore } from "rate-limit-redis";
import { redis } from "@/lib/redis";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (command: string, ...args: string[]) =>
      redis.call(command, ...args) as Promise<RedisReply>,
  }),
});
