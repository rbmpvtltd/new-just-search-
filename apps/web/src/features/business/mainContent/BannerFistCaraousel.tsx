"use client";

import Autoplay from "embla-carousel-autoplay";
import { CldImage } from "next-cloudinary";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

type BannerFirstCaraousel = {
  photo: string | null;
  id: number;
};

function FirstCaraousel({
  bannerFirst,
}: {
  bannerFirst: BannerFirstCaraousel[] | null;
}) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);

  const autoplay = useRef(
    Autoplay({
      delay: 2000,
      stopOnInteraction: false,
    }),
  );

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    onSelect();
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      plugins={[autoplay.current]}
      opts={{
        loop: true,
        align: "center",
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {bannerFirst?.map((item, index) => {
          const isCenter = index === current;

          return (
            <CarouselItem
              key={item.id || index}
              className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/5 py-4 basis-7/12"
            >
              <div
                className={`transition-all duration-300 ease-out ${
                  isCenter
                    ? "z-10 scale-100 md:scale-105 lg:scale-110"
                    : "opacity-70 scale-95 md:scale-95 lg:scale-90"
                }`}
              >
                <Card className="overflow-hidden border-none shadow-sm">
                  <CardContent className="relative aspect-square p-0 flex items-center justify-center bg-white">
                    <CldImage
                      fill
                      src={item?.photo ?? ""}
                      alt="banner image"
                      className="object-contain"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}

export default FirstCaraousel;
