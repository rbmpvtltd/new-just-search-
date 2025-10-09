import CarouselCompo from "../Carousel/Carousel";
import MainCard from "../cards/MainCard";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { Loading } from "../ui/Loading";
import { Text } from "react-native";



function Banner1() {
  // const { data } = useSuspenceData(BANNER_URL.url, BANNER_URL.key);
  const { data, isLoading, error, isError } = useQuery(
    trpc.banners.getBannerData.queryOptions({type:1}),
  );
  console.log(data)
  if (isLoading) {
    return <Loading position="center" />

  }
  if (isError) {
    return <Text className="text-secondary"> {error.message}dfasdf</Text>;
  }

  console.log(data);
  return (
    <CarouselCompo
      data={data ?? []}
      renderItem={({ item }) => <MainCard item={item} />}
      height={400}
      mode="parallax"
    />
  );
}

export default Banner1;
