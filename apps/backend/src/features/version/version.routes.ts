import z from "zod";
import { redis } from "@/lib/redis";
import { adminProcedure, publicProcedure, router } from "@/utils/trpc";

export const versionRouter = router({
  checkLatestVesion: publicProcedure.query(async () => {
    const productionVersion = await redis.get("production-version");
    return productionVersion;
  }),
  setLatestVersion: adminProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      await redis.set("production-version", input);
      return;
    }),
});
