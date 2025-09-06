import React from "react";
import CarouselCompo from "../Carousel/Carousel";
import { useSuspenceData } from "@/query/getAllSuspense";
import { BANNER_URL } from "@/constants/apis";
import MainCard from "../cards/MainCard";
import { Text } from "react-native-gesture-handler";

function Banner3() {
  const { data } = useSuspenceData(BANNER_URL.url, BANNER_URL.key);
  const bannerTwo = data?.data?.banners2;

  return (
    <>
      <CarouselCompo
        height={400}
        data={bannerTwo}
        renderItem={({ item }) => <MainCard item={item} />}
        mode="horizontal-stack"
      />
    </>
  );
}

export default Banner3;
