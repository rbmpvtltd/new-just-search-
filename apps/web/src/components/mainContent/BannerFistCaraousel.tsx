"use client";
import { Card, CardContent } from "@/components/ui/card";
import { CldImage } from "next-cloudinary";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";

type BannerFirstCaraousel = {
	photo: string | null;
	id: number;
} ;

function FirstCaraousel({
	bannerFirst,
}: {
	bannerFirst: BannerFirstCaraousel[] | null;
}) {
	return (
		<Carousel className="w-full ">
			<CarouselContent className="ml-10">
				{bannerFirst?.map((item, index: number) => (
					<CarouselItem
						key={index.toString()}
						className="pl-1 md:basis-1/2 lg:basis-1/4"
					>
						<div className="p-1">
							<Card>
								<CardContent className="flex aspect-square items-center justify-center">
									<CldImage
										width={400}
										height={400}
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
