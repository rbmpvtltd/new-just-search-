"use server";
import "server-only";
import { cookies } from "next/headers";

export async function setToken(token: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const cookieStore = await cookies();

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
  return true;
}

export async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token");
}

export async function delToken() {
  const cookieStore = await cookies();
  return cookieStore.delete("token");
}
