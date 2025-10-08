import { redis } from "@/lib/redis";

export async function canUploadImage(userId: number): Promise<boolean> {
  const key = `user:${userId}:uploads`;
  const count = await redis.decr(key);
  console.log("===count is ======", count);

  if (count <= 0) {
    await redis.expire(key, 60 * 60 * 24);
    return false;
  }

  return true;
}

export const setCountUploadImage = async (userId: number, count: number) => {
  const key = `user:${userId}:uploads`;
  await redis.setex(key, 60 * 60 * 24, count);
  const count2 = await redis.get(key);
  console.log("===count is ======", count2);
  return true;
};
