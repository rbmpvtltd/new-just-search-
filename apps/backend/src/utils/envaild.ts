import dotenv from "dotenv";
import { cleanEnv, num, str } from "envalid";

dotenv.config({
  path: "../../.env",
});

const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["development", "test", "production"],
    default: "development",
  }),
  CLOUDINARY_CLOUD_NAME: str(),
  CLOUDINARY_API_KEY: str(),
  CLOUDINARY_API_SECRET: str(),
  REDIS_USERNAME: str(),
  REDIS_PASSWORD: str(),
  REDIS_HOST: str({
    default: "127.0.0.1",
  }),
  REDIS_PORT: num({
    default: 6379,
  }),
});

export default env;
