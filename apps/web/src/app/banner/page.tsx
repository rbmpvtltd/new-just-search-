import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  bannersFirst,
  bannersFourt,
  bannersSecond,
  bannersThird,
} from "../action";

const BannerFirstCaraousel = async () => {
  const bannerFirst = await bannersFirst();
  const bannerSecond = await bannersSecond();
  const bannerThird = await bannersThird();
  const bannerFourth = await bannersFourt();
  return (
    <Carousel className="w-full ">
      <CarouselContent className="ml-10">
        {bannerFirst.map((item, index: number) => (
          <CarouselItem
            key={index.toString()}
            className="pl-1 md:basis-1/2 lg:basis-1/4"
          >
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center">
                  <Image
                    src={`https://www.justsearch.net.in/assets/images/banners/${item?.photo}`}
                    alt="banner image"
                    width={400}
                    height={400}
                    className="rounded-md"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default function Page() {
  return (
    <div className="mx-auto">
      <BannerFirstCaraousel />
    </div>
  );
}
