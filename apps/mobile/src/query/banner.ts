
async function bannersFirst() {
  console.log("execution comes here");
  const data = await trpc.banners.firstBanner.query();
  console.log("res is ");
  return data;
}

bannersFirst();

async function bannersSecond() {
  const data = await trpc.banners.secondBanner.query();
  return data;
}

async function bannersThird() {
  const data = await trpc.banners.thirdBanner.query();
  return data;
}

async function bannerFourt() {
  const data = await trpc.banners.fourthBanner.query();
  console.log(
    "====================== second banners data ==================================>",
    data,
  );
  return data;
}

export { bannersFirst, bannersSecond, bannersThird, bannerFourt };
