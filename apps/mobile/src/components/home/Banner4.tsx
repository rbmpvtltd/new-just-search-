import React from "react";
import { BANNER_URL } from "@/constants/apis";
import { useSuspenceData } from "@/query/getAllSuspense";
import CarouselCompo from "../Carousel/Carousel";
import MainCard from "../cards/MainCard";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { Loading } from "../ui/Loading";
import { Text } from "react-native";

function Banner4() {
  // const { data } = useSuspenceData(BANNER_URL.url, BANNER_URL.key);
  // const bannerThree = data?.data?.banners3;
  const { data, isLoading, isError,error } = useQuery(
    trpc.banners.fourthBanner.queryOptions(),
  );

  if (isLoading) {
    return <Loading position="center" />;
  }
  if (isError) {
    return <Text className="text-secondary">{error.message}</Text>;
  }

  return (
    <CarouselCompo
      data={data ?? []}
      renderItem={({ item }) => <MainCard item={item} />}
      height={290}
      mode="horizontal-stack"
    />
  );
}

export default Banner4;
