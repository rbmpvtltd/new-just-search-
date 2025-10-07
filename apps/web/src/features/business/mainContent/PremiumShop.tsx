import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../../../components/ui/carousel";
import { Card, CardContent } from "../../../components/ui/card";
import Image from "next/image";
import { GoHeart } from "react-icons/go";
import Rating from "../../../components/ui/Rating";
import { Badge } from "../../../components/ui/badge";
import { MdLocationPin } from "react-icons/md";

async function PremiumShop() {
  const { data } = await asyncHandler(trpcServer.banners.premiumShops.query());
  return (
    <div className="py-4 mt-5">
      <h1 className="text-4xl text-primary font-bold text-center">
        Premium Shops{" "}
      </h1>
      <Carousel className="w-full ">
        <CarouselContent className="ml-10">
          {data?.map((item, index: number) => (
            <CarouselItem
              key={index.toString()}
              className="pl-1 md:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1">
                <Card className="">
                  <CardContent className="flex  justify-center ">
                    <div className="p-2 shadow-2xl ">
                      <div className="relative max-w-[400px] mx-auto ">
                        <Image
                          width={400}
                          height={200}
                          className="rounded-md object-cover"
                          alt="Bussiness Image"
                          src="https://www.justsearch.net.in/assets/images/banners/uDgo0nRB1738750520.png"
                        />
                        <div className="absolute top-2 right-2 bg-primary rounded-full p-2">
                          <GoHeart />
                        </div>
                      </div>
                      <Rating
                        className="p-2"
                        rating={Math.ceil(Number(item.rating))}
                        size={10}
                      />
                      <h1 className="p-2 font-semibold">{item.name}</h1>
                      <div className="p-2 flex gap-2 flex-wrap">
                        <Badge variant="default">{item.category}</Badge>

                        {item.subcategories
                          .slice(0, 2)
                          .map((subcategory, index) => (
                            <Badge variant="destructive" key={index.toString()}>
                              {subcategory}
                            </Badge>
                          ))}
                      </div>
                      <div className="flex p-2">
                        <MdLocationPin />
                        <p className="px-2 text-[12px] flex text-secondary-text break-words w-[80%] ">
                          {item.area} {item.streetName} {item.buildingName}
                        </p>
                      </div>
                    </div>
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

export default PremiumShop;
