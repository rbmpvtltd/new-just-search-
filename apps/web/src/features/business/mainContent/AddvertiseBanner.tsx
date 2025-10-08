"use client"
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import type { OutputTrpcType } from "@/trpc/type";
import { CldImage } from "next-cloudinary";

type AddvertiseBannerType = OutputTrpcType["banners"]["getBannerData"] | null

function AddvertiseBanner({addvertiseBanner}:{addvertiseBanner:AddvertiseBannerType}) {
  return (
    <Carousel opts={{
        loop : true
    }} className="w-full ">
			<CarouselContent className="ml-10">
				{addvertiseBanner?.map((item, index: number) => (
					<CarouselItem
						key={index.toString()}
						className="pl-1 md:basis-1/2 lg:basis-1/3"
					>
						<div className="p-1">
							<Card>
								<CardContent className="flex aspect-square items-center justify-center">
									<CldImage
										width={300}
										height={300}
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

export default AddvertiseBanner
