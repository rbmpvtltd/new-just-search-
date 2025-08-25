// // src/context.ts
// import { inferAsyncReturnType } from "@trpc/server";
// import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
// import jwt from "jsonwebtoken";
//
// export async function createContext({ req, res }: CreateExpressContextOptions) {
//   const token = req.headers.authorization?.split(" ")[1];
//
//   let session: { userId: string } | null = null;
//
//   if (token) {
//     try {
//       const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
//       session = { userId: payload.userId };
//     } catch (err) {
//       // invalid token -> session stays null
//     }
//   }
//
//   return { req, res, session };
// }
//
// export type Context = inferAsyncReturnType<typeof createContext>;
