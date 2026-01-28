"use client";

import Image from "next/image";
import { CldImage } from "next-cloudinary";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { OutputTrpcType } from "@/trpc/type";
import { ShopTabBar } from "./component/ShopTabBar";

type ShopType = OutputTrpcType["businessrouter"]["singleShop"] | null;

export function SingleShopTabBar({
  businessPhotos,
  shop,
}: {
  businessPhotos: string[] | undefined;
  shop: ShopType;
}) {
  console.log("Single shop", shop);

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
                      unoptimized
                      width="500"
                      height="400"
                      className="rounded-md"
                      src={`${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL}/${shop?.photo ?? ""}`}
                      alt="Shop Image"
                    />
                    {/* <CldImage
                      width="500"
                      height="400"
                      className="rounded-md"
                      src={shop?.photo ?? ""}
                      alt="Shop Image"
                    /> */}
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
            {businessPhotos?.map((item, index: number) => (
              <CarouselItem
                key={index.toString()}
                className="pl-1 basis-1/1 sm:basis-1/2"
              >
                <div className="py-1">
                  <Card>
                    <CardContent className="flex items-center justify-center">
                      <Image
                        unoptimized
                        width="500"
                        height="400"
                        className="rounded-md"
                        src={`${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL}/public${item ?? ""}`}
                        alt="Shop Image"
                      />
                      {/* <CldImage
                        width="500"
                        height="400"
                        className="rounded-md"
                        src={item ?? ""}
                        alt="Shop Image"
                      /> */}
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
