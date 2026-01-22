import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import CarouselCompo from "../../../components/Carousel/Carousel";
import Card from "../../../components/cards/Card";

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
