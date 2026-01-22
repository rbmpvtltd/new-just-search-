import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import CarouselCompo from "../../../components/Carousel/Carousel";
import MainCard from "../../../components/cards/MainCard";

function Banner3() {
  const { data, isLoading, isError } = useQuery(
    trpc.banners.getBannerData.queryOptions({ type: 3 }),
  );

  return (
    <CarouselCompo
      height={400}
      data={data ?? []}
      renderItem={({ item }) => <MainCard item={item} />}
      mode="horizontal-stack"
    />
  );
}

export default Banner3;
