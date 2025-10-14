import React from "react";
import CarouselCompo from "../Carousel/Carousel";
import { useSuspenceData } from "@/query/getAllSuspense";
import { BANNER_URL } from "@/constants/apis";
import MainCard from "../cards/MainCard";
import { Text } from "react-native-gesture-handler";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";

function Banner3() {
  const {data,isLoading,isError} = useQuery(trpc.banners.getBannerData.queryOptions({type:3}))

  return (
    <CarouselCompo
      height={400}
      data={data??[]}
      renderItem={({ item }) => <MainCard item={item} />}
      mode="horizontal-stack"
    />
  );
}

export default Banner3;
