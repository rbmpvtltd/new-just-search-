import { db } from "@repo/db";
import { chatTokenSessions } from "@repo/db/dist/schema/help-and-support.schema";
import { eq } from "drizzle-orm";
export const tokenGenerator = async (): Promise<string> => {
  const token =
    "#TKT" +
    Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");
  const isTokenExists = await db
    .select({ tokenNumber: chatTokenSessions.tokenNumber })
    .from(chatTokenSessions)
    .where(eq(chatTokenSessions.tokenNumber, token));
  if (isTokenExists.length > 0) {
    return tokenGenerator();
  } else {
    return token;
  }
};
