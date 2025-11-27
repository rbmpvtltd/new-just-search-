import CarouselCompo from "../../../components/Carousel/Carousel";
import MainCard from "../../../components/cards/MainCard";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { Loading } from "../../../components/ui/Loading";
import { Text } from "react-native";

function Banner4() {
  // const { data } = useSuspenceData(BANNER_URL.url, BANNER_URL.key);
  // const bannerThree = data?.data?.banners3;
  const { data, isLoading, isError,error } = useQuery(
    trpc.banners.getBannerData.queryOptions({type:2}),
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
