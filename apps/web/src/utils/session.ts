"use server";
import type { UserRole } from "@repo/db";
import { cookies } from "next/headers";

export async function setToken(token: string) {
  const cookieStore = await cookies();
  const persist = process.env.NODE_ENV === "production";

  if (persist) {
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
  } else {
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });
  }

  return true;
}

export async function delToken() {
  const cookieStore = await cookies();
  return cookieStore.delete("token");
}

export async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token");
}

export async function setRole(role: string, persist = false) {
  const cookieStore = await cookies();

  if (persist) {
    cookieStore.set("role", role, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      expires: new Date(Date.now() + 5 * 1000), // 5 seconds
    });
  } else {
    cookieStore.set("role", role, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });
  }

  return true;
}

export async function getRole(): Promise<UserRole> {
  const cookieStore = await cookies();
  if (!cookieStore.get("role")) return "guest";
  return cookieStore.get("role")?.value as UserRole;
}
