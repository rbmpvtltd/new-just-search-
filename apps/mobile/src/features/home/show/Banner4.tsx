import { useQuery } from "@tanstack/react-query";
import { Text } from "react-native";
import { trpc } from "@/lib/trpc";
import CarouselCompo from "../../../components/Carousel/Carousel";
import MainCard from "../../../components/cards/MainCard";
import { Loading } from "../../../components/ui/Loading";

function Banner4() {
  const { data, isLoading, isError, error } = useQuery(
    trpc.banners.getBannerData.queryOptions({ type: 2 }),
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
