"use server";

import { setToken } from "@/utils/session";
import { trpc } from "@/utils/trpc";

export async function serverFunction() {
  const token = (await trpc.auth.login.query({
    email: "otherritik000@gmail.com",
    password: "12345678",
  })) as string;
  setToken(token);
}

export async function banners() {
  await trpc.banners.;

  const data = await trpc.hi.hi2.query();
  return data;
}
