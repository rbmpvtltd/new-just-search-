import { BANNER_URL } from "@/constants/apis";
import { useSuspenceData } from "@/query/getAllSuspense";
import CarouselCompo from "../Carousel/Carousel";
import MainCard from "../cards/MainCard";

function Banner1() {
  const { data } = useSuspenceData(BANNER_URL.url, BANNER_URL.key);
  const bannerOne = data?.data?.banners1;

  return (
    <CarouselCompo
      data={bannerOne}
      renderItem={({ item }) => <MainCard item={item} />}
      height={400}
      mode="parallax"
    />
  );
}

export default Banner1;
