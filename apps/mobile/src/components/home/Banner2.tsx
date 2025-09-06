import React from "react";
import { BANNER_URL } from "@/constants/apis";
import { useSuspenceData } from "@/query/getAllSuspense";
import CarouselCompo from "../Carousel/Carousel";
import Card from "../cards/Card";

function Banner2() {
  const { data } = useSuspenceData(BANNER_URL.url, BANNER_URL.key);
  const premiumShops = data?.data?.premium_shops;

  return (
    <CarouselCompo
      data={premiumShops}
      renderItem={({ item }) => <Card item={item} />}
      height={500}
      mode="parallax"
    />
  );
}

export default Banner2;
