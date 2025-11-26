"use client";
import { useSubscription } from "@trpc/tanstack-react-query";
import { CldImage } from "next-cloudinary";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useTRPC } from "@/trpc/client";

type BannerFirstCaraousel = {
  photo: string | null;
  id: number;
};

function FirstCaraousel({
  bannerFirst,
}: {
  bannerFirst: BannerFirstCaraousel[] | null;
}) {
  console.log(bannerFirst);

  return (
    <Carousel opts={{ loop: true }} className="w-full ">
      <CarouselContent className="ml-10">
        {bannerFirst?.map((item, index: number) => (
          <CarouselItem
            key={index.toString()}
            className="pl-1 md:basis-1/3 lg:basis-1/4 sm:basis-1/2"
          >
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center">
                  <CldImage
                    width={320}
                    height={320}
                    alt="banner image"
                    src={item?.photo ?? ""}
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

export default FirstCaraousel;
