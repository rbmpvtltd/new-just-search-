"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { ShopTabBar } from "./component/ShopTabBar";
import type { OutputTrpcType } from "@/trpc/type";

type ShopType =
  | OutputTrpcType["businessrouter"]["singleShop"]
  | null;



export function SingleShopTabBar({
  businessPhotos,
  shop
}: {
  businessPhotos: string[] | undefined;
  shop : ShopType
}) {
  return (
    <div>
      <div className="flex w-[95%] sm:w-[70%] flex-col  mx-auto shadow-2xl">
        <Carousel opts={{ loop: true }} className="w-full ">
          <CarouselContent className="ml-10">
          <CarouselItem className="pl-1 basis-1/1 sm:basis-1/2 ">
                <div className="py-1">
                  <Card>
                    <CardContent className="flex items-center justify-center">
                      <Image
                        width={500}
                        height={400}
                        alt="banner image"
                        src="https://www.justsearch.net.in/assets/images/2642394691738214177.jpg" // TODO : change photo url with shop.photo when upload on cloudinary
                        className="rounded-md"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            {businessPhotos?.map((item, index: number) => (
              <CarouselItem key={index.toString()} className="pl-1 basis-1/1 sm:basis-1/2">
                <div className="py-1">
                  <Card>
                    <CardContent className="flex items-center justify-center">
                      <Image
                        width={500}
                        height={400}
                        alt="banner image"
                        src="https://www.justsearch.net.in/assets/images/2642394691738214177.jpg" // TODO : change photo url when upload on cloudinary
                        className="rounded-md"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      <div className="flex w-[95%] sm:w-[70%] flex-col  mx-auto shadow-2xl mt-10">
        <ShopTabBar singleShop={shop} />
      </div>
    </div>
  );
}
