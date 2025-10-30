"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import React from "react";
import type { OutputTrpcType } from "@/trpc/type";
import { Button } from "@/components/ui/button";
import { FaRegCalendarAlt } from "react-icons/fa";
import Rating from "@/components/ui/Rating";
import parse from "html-react-parser";


type SingleProductType =
  | OutputTrpcType["businessrouter"]["singleProduct"]
  | null;

type ProductRatingType = OutputTrpcType["businessrouter"]["singleProduct"]

function SingleProductComp({
  productPhotos,
  product,
}: {
  productPhotos: string[];
  product: SingleProductType;
}) {
  const content = parse(product?.description ?? "");
  return (
    <div>
      <div className="flex gap-6 items-center">
        <Carousel opts={{ loop: true }} className="w-[40%]">
          <CarouselContent className="ml-5">
            {productPhotos?.map((item, index: number) => (
              <CarouselItem key={index.toString()} className="pl-1 basis-1/1">
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
        <div className="w-[50%] flex flex-col gap-2">
          <h2 className="font-medium">{product?.shopName}</h2>
          <h1 className="text-2xl line-clamp-1 text-secondary font-semibold">
            {product?.name}
          </h1>
          <div>{content}</div>

          <h1 className="text-xl text-primary">
            ₹ <span className="text-secondary">{product?.rate}</span>
          </h1>
          <div className="flex gap-4">
            <Button
              onClick={() =>
                console.log(
                  `clicked on view Shop Button Shop will be open with id no ${product?.businessId}`,
                )
              }
            >
              View Shop Detail
            </Button>
            <Button
              onClick={() => console.log(`clicked on enquire now button`)}
            >
              Enquire Now
            </Button>
          </div>
        </div>
      </div>
      <div className="w-[80%] mx-auto mt-5">
        {product?.rating?.map((item, index) => {
          return (
            <div
              key={index.toString()}
              className=" p-2 m-2 shadow-[0_4px_12px_rgba(0,0,0,0.650)] w-full rounded-md flex flex-col gap-2"
            >
              <div className="flex justify-between items-center w-full ">
                <h1 className="text-xl font-medium text-secondary">
                  {item?.user}
                </h1>
                <p className="flex items-center gap-2 text-sm">
                  <FaRegCalendarAlt className="text-primary" />{" "}
                  {new Date(item?.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <Rating rating={item?.rating} />
              <p>{item?.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SingleProductComp;
