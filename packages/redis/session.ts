// session.ts
import session from "express-session";
import {RedisStore} from "connect-redis"
import { valkey } from "./valkey";
import {createClient} from "redis"


const redisClient = createClient()
redisClient.connect().catch(console.error)


const redisStore = new RedisStore({
    client: redisClient,
    prefix: "justsearch:",
})

export const sessionMiddleware = session({
  store: redisStore,
  secret: "rbm00just-search", // use env variable
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // set true in production with HTTPS
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
});
