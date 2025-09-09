import { publicProcedure, router } from "@/utils/trpc";

export const testRouter = router({
  firstData: publicProcedure.query(async () => {
    const data = {
      hello: "hello from backend",
    };
    return data;
  }),
});
