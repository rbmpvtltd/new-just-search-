"use client"
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import type { OutputTrpcType } from "@/trpc/type";
import { CldImage } from "next-cloudinary";

type AddvertiseBannerType = OutputTrpcType["banners"]["getBannerData"] | null

function AddvertiseBanner2({addvertiseBanner}:{addvertiseBanner:AddvertiseBannerType}) {
  return (
    <Carousel opts={{
        loop : true
    }} className="w-full ">
            <CarouselContent className="ml-10">
                {addvertiseBanner?.map((item, index: number) => (
                    <CarouselItem
                        key={index.toString()}
                        className="pl-1 basis-1/1"
                    >
                        <div className="p-1">
                            <Card>
                                <CardContent className="flex items-center justify-center">
                                    <CldImage
                                        width={1400}
                                        height={1400}
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
  )
}

export default AddvertiseBanner2
