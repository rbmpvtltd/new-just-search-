import React from "react";
import { BANNER_URL } from "@/constants/apis";
import { useSuspenceData } from "@/query/getAllSuspense";
import CarouselCompo from "../Carousel/Carousel";
import MainCard from "../cards/MainCard";

function Banner4() {
  const { data } = useSuspenceData(BANNER_URL.url, BANNER_URL.key);
  const bannerThree = data?.data?.banners3;

  return (
    <CarouselCompo
      data={bannerThree}
      renderItem={({ item }) => <MainCard item={item} />}
      height={290}
      mode="horizontal-stack"
    />
  );
}

export default Banner4;
