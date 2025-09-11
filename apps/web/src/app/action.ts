"use server";

import { trpcServer } from "@/trpc/trpc-server";
import { setToken } from "@/utils/session";

async function serverFunction() {
  const token = (await trpcServer.auth.login.mutate({
    email: "otherritik000@gmail.com",
    password: "12345678",
  })) as string;
  setToken(token);
}

async function bannersFirst() {
  const data = await trpcServer.banners.firstBanner.query();
  return data;
}

async function bannersSecond() {
  const data = await trpcServer.banners.secondBanner.query();
  return data;
}

async function bannersThird() {
  const data = await trpcServer.banners.thirdBanner.query();
  return data;
}

async function bannersFourt() {
  const data = await trpcServer.banners.fourthBanner.query();
  console.log(
    "====================== second banners data ==================================>",
    data,
  );
  return data;
}

export {
  serverFunction,
  bannersFirst,
  bannersSecond,
  bannersThird,
  bannersFourt,
};
