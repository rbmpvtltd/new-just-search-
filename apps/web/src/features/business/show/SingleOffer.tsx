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

type SingleOfferType = OutputTrpcType["businessrouter"]["singleOffer"] | null;

function SingleOfferComp({
  offerPhotos,
  offer,
}: {
  offerPhotos: string[];
  offer: SingleOfferType;
}) {
  return (
    <div>
      <div className="flex gap-6 items-center">
        <Carousel opts={{ loop: true }} className="w-[40%]">
          <CarouselContent className="ml-5">
            {offerPhotos?.map((item, index: number) => (
              <CarouselItem key={index.toString()} className="pl-1 basis-1/1">
                <div className="py-1">
                  <Card>
                    <CardContent className="flex items-center justify-center">
                      <div className="relative">
                        <Image
                          width={500}
                          height={400}
                          alt="offer image"
                          src="https://www.justsearch.net.in/assets/images/2642394691738214177.jpg" // TODO : change photo url when upload on cloudinary
                        />
                        <span className="absolute z-1 top-5 w-[90px] bg-error text-end px-4 text-white rounded-r-md">
                          -{offer?.discountPercent}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="w-[50%] flex flex-col gap-2">
          <h2 className="font-medium">{offer?.shopName}</h2>
          <h1 className="text-2xl line-clamp-1 text-secondary font-semibold">
            {offer?.name}
          </h1>
          <div
            className="line-clamp-5"
            dangerouslySetInnerHTML={{ __html: offer?.description }}
          />

          <h1 className="text-xl text-primary">
            <span className="text-secondary">
              <strike>₹ {offer?.rate}</strike>
            </span>{" "}
            ₹ {offer?.finalPrice}
          </h1>
          <div className="flex gap-4">
            <Button
              onClick={() =>
                console.log(
                  `clicked on view Shop Button Shop will be open with id no ${offer?.businessId}`,
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
      <div className="w-[80%] mx-auto mt-10">
        <h1 className="text-2xl font-semibold text-secondary mb-4">
          Recommended Reviews
        </h1>
        <div className="mx-auto bg-primary-accent px-6 py-4 rounded-lg">
          <h1 className="text-secondary text-center">
            No Reviews Founds On {offer?.shopName} Shop
          </h1>
        </div>
      </div>
      {/* TODO : uncommen when offer review seeding complete correctly */}
      {/* <div className="w-[80%] mx-auto mt-5">
        {offer?.rating?.map((item, index) => {
          return (
            <div
              key={index.toString()}
              className=" p-2 m-2 shadow-[0_4px_12px_rgba(0,0,0,0.650)] w-full rounded-md flex flex-col gap-2"
            >
              <div className="flex justify-between items-center w-full ">
                <h1 className="text-xl font-medium text-secondary">
                  {item.user}
                </h1>
                <p className="flex items-center gap-2 text-sm">
                  <FaRegCalendarAlt className="text-primary" />{" "}
                  {new Date(item.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <Rating rating={item.rating} />
              <p>{item.message}</p>
            </div>
          );
        })}
      </div> */}
    </div>
  );
}

export default SingleOfferComp;
