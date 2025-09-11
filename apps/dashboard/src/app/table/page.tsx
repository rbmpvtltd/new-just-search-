
import { DataTable } from "@/components/data-table-1";
import type { ColumnDef } from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Image from "next/image";
import { bannersFirst, bannersFourt, bannersSecond, bannersThird } from "./action";




export default async function Page() {
  const firstBannerData = await bannersFirst();
  const secondBannerData = await bannersSecond(); // will be using in second banner
  const thirdBannerData = await bannersThird(); // will be using in third banner
  const fourthBannerData = await bannersFourt(); // will be using in forth banner
  console.log(firstBannerData)
  return (
    <div className="pt-18">
      <Carousel className="w-full ">
      <CarouselContent className="-ml-1">
        {firstBannerData.map((banner) => (
          <CarouselItem key={banner.id.toString()} className="pl-1 md:basis-1/2 lg:basis-1/4 rounded-lg">
            <div className="">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center">
                  <Image
                    src={`https://www.justsearch.net.in/assets/images/banners/${banner.photo}`}
                    alt="banner image"
                    width={600}
                    height={600}
                    className="rounded-lg"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      
    </Carousel>
    </div>
  );
}
