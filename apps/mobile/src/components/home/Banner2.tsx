import React from "react";
import { BANNER_URL } from "@/constants/apis";
import { useSuspenceData } from "@/query/getAllSuspense";
import CarouselCompo from "../Carousel/Carousel";
import Card from "../cards/Card";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";

function Banner2() {
  const { data } = useQuery(trpc.banners.premiumShops.queryOptions());

  return (
    <CarouselCompo
      data={data}
      renderItem={({ item }) => <Card item={item} />}
      height={500}
      mode="parallax"
    />
  );
}

export default Banner2;
