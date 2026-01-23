import { cleanEnv, num, str } from "envalid";

const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["development", "test", "production"],
    default: "development",
  }),
  FAST2SMS_SENDER_ID: str(),
  FAST2SMS_API_KEY: str(),
  FAST2SMS_TMP_ID: str(),
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
  BCRYPT_SALT: num({
    default: 10,
  }),
  RAZOR_PAY_KEY_ID: str(),
  RAZOR_PAY_KEY_SECRET: str(),
  REVENUE_CAT_PROJECT_ID: str(),
  REVENUE_CAT_SECRET: str(),
  REVENUECAT_TOKEN: str(),
});

export default env;
