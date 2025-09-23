import { TRPCError } from "@trpc/server";
import z from "zod";
import { setCountUploadImage } from "@/utils/cloudinaryCount";
import { protectedProcedure, publicProcedure, router } from "@/utils/trpc";

export const testRouter = router({
  
  addImage: protectedProcedure.query(async ({ ctx }) => {
    await setCountUploadImage(ctx.userId, 2);
    return;
  }),
  table: publicProcedure
    .input(
      z.object({
        pagination: z.object({
          pageIndex: z.number(),
          pageSize: z.number(),
        }),
      }),
    )
    .query(async ({ input }) => {
      if (input.pagination.pageSize === 20) {
        return {
          pageCount: 1,
          data: [...data1, ...data2],
          totalCount: 20,
          totalPages: 1,
        };
      }
      if (input.pagination.pageIndex === 1) {
        return {
          pageCount: 2,
          data: data2,
          totalCount: 20,
          totalPages: 2,
        };
      }
      if (input.pagination.pageIndex === 0) {
        return {
          pageCount: 1,
          data: data1,
          totalCount: 20,
          totalPages: 2,
        };
      }
    }),
});

const data2 = [
  {
    id: "11",
    title: "Hello-World",
  },
  {
    id: "12",
    title: "World-Acot",
  },
  {
    id: "13",
    title: "Goodbye-10",
  },
  {
    id: "14",
    title: "World-Store",
  },
  {
    id: "15",
    title: "Goodbye2",
  },
  {
    id: "16",
    title: "Goodbye1",
  },
  {
    id: "17",
    title: "Hello10",
  },
  {
    id: "18",
    title: "Mera12",
  },
  {
    id: "19",
    title: "Naasdfm",
  },
  {
    id: "20",
    title: "Ranjeet1",
  },
];
const data1 = [
  {
    id: "1",
    title: "Hello",
  },
  {
    id: "2",
    title: "World",
  },
  {
    id: "3",
    title: "Goodbye",
  },
  {
    id: "4",
    title: "World",
  },
  {
    id: "5",
    title: "Goodbye",
  },
  {
    id: "6",
    title: "Goodbye",
  },
  {
    id: "7",
    title: "Hello",
  },
  {
    id: "8",
    title: "Mera",
  },
  {
    id: "9",
    title: "Naam",
  },
  {
    id: "10",
    title: "Ranjeet",
  },
];
