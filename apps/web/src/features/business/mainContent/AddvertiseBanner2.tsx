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

type AddvertiseBannerType = OutputTrpcType["banners"]["getBannerData"] | null;

function AddvertiseBanner2({
  addvertiseBanner,
}: {
  addvertiseBanner: AddvertiseBannerType;
}) {
  return (
    <Carousel
      opts={{
        loop: true,
      }}
      className="w-full "
    >
      <CarouselContent className="ml-10">
        {addvertiseBanner?.map((item, index: number) => (
          <CarouselItem key={index.toString()} className="pl-1 basis-1/1">
            <div className="p-1">
              <Card>
                <CardContent className="flex items-center justify-center">
                  {/* <CldImage
                    width={1400}
                    height={1400}
                    alt="banner image"
                    src={item?.photo ?? ""}
                  /> */}
                  <Image
                    unoptimized
                    width={1400}
                    height={1400}
                    src={`${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL}/${item?.photo ?? ""}`}
                    alt="banner image"
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

export default AddvertiseBanner2;
