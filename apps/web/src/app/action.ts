"use server";

import { setToken } from "@/utils/session";
import { trpc } from "@/utils/trpc";

async function serverFunction() {
  const token = (await trpc.auth.login.query({
    email: "otherritik000@gmail.com",
    password: "12345678",
  })) as string;
  setToken(token);
}

export async function banners() {
  await trpc.banners;

async function bannersFirst (){
  const data = await trpc.banners.firstBanner.query()
  return data
}

async function bannersSecond (){
  const data = await trpc.banners.secondBanner.query()
  return data
}

async function bannersThird (){
  const data = await trpc.banners.thirdBanner.query()
  return data
}

async function bannerFourt (){
  const data = await trpc.banners.fourthBanner.query()
  console.log("====================== second banners data ==================================>",data)
  return data

}



export {serverFunction,bannersFirst,bannersSecond,bannersThird,bannerFourt}
