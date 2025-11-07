"use client";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { OutputTrpcType } from "@/trpc/type";
import { FaPhoneAlt } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import { FaWhatsappSquare } from "react-icons/fa";
import { IoChatbubbleEllipses, IoMail } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import GoMap from "@/components/ui/Map";
import Rating from "@/components/ui/Rating";
import { FaRegCalendarAlt } from "react-icons/fa";
import Link from "next/link";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

type SingleShopType = OutputTrpcType["businessrouter"]["singleShop"] | null;

export function ShopTabBar({ singleShop }: { singleShop: SingleShopType }) {
  // const schedule = Object.entries(singleShop?.schedule ?? {});
  const latitude = Number(singleShop?.latitude?.split(",").shift());
  const longitude = Number(singleShop?.longitude?.split(",").pop());

  const handleClick = () => {
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(googleMapsUrl, "_blank"); // opens in new tab
  };

  return (
    <div className="flex w-full  flex-col gap-6 mb-12">
      <Tabs defaultValue="about">
        <TabsList>
          <TabsTrigger value="about">About Business</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <hr />
        <TabsContent value="about">
          <div className="p-4 flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">{singleShop?.name}</h1>
            <div className="flex items-center gap-2 ">
              <MdLocationPin />
              <p className="text-sm">
                {singleShop?.area} {singleShop?.streetName}{" "}
                {singleShop?.buildingName}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex gap-2 items-center">
                <FaPhoneAlt />
                <Badge variant="destructive">{singleShop?.phoneNumber}</Badge>
              </div>

              {singleShop?.whatsappNo && (
                <div className="flex items-center gap-2">
                  ,
                  <FaWhatsappSquare />
                  <Badge variant="default">{singleShop?.whatsappNo}</Badge>
                </div>
              )}
              {singleShop?.email && (
                <div className="flex items-center gap-2">
                  ,
                  <IoMail />
                  <Badge variant="default">{singleShop?.email}</Badge>
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">
                <b>Home Delivery</b> : {singleShop?.homeDelivery ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <p className="font-medium">
                <b> Specialist in</b> : {singleShop?.specialities}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap w-full">
              <p className="font-medium">
                <b>Categories</b>:
              </p>
              <Badge variant="default">{singleShop?.category}</Badge>

              {singleShop?.subcategories.map((subcategory, index) => (
                <Badge variant="destructive" key={index.toString()}>
                  {subcategory}
                </Badge>
              ))}
            </div>
            <div className="flex gap-4 w-[70%] justify-between">
              <Button
                onClick={handleClick}
                type="button"
                className=" whitespace-nowrap flex items-center text-white font-semibold gap-2 hover:scale-105 transition-all transform duration-300"
              >
                <MdLocationPin />
                Get Direction
              </Button>
              <Button
                onClick={() => {
                  console.log("chatting with", singleShop?.id);
                }}
                type="button"
                className=" whitespace-nowrap flex items-center text-white font-semibold gap-2 py-2 px-4 rounded-lg hover:scale-105 transition-all transform duration-300"
              >
                <IoChatbubbleEllipses />
                Chat Now
              </Button>
              {/* </div> */}
              <Button
                onClick={() => {
                  console.log("calling on", singleShop?.phoneNumber);
                }}
                type="button"
                className="flex whitespace-nowrap items-center text-white font-semibold gap-2 hover:scale-105 transition-all transform duration-300"
              >
                <FaPhoneAlt />
                Contact Now
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="products">
          <ShopProducts shopId={Number(singleShop?.id)} shopName={singleShop?.name ?? ""}/>
        </TabsContent>
        <TabsContent value="offers">
          <ShopOffers
            shopId={Number(singleShop?.id)}
            shopName={singleShop?.name ?? ""}
          />
        </TabsContent>
        <TabsContent value="location">
          <div className="p-4 flex flex-wrap justify-between gap-4">
            <GoMap
              latitude={singleShop?.latitude}
              longitude={singleShop?.longitude}
              title={singleShop?.name}
            />
            {/* <div className="md:w-[80%] w-full mx-auto">
              {schedule.map((item, index) => {
                return (
                  <div
                    key={index.toString()}
                    className="flex gap-8 justify-between w-[60%]"
                  >
                    <h1 className="font-semibold">{item[0]}</h1>
                    {Object.keys(item[1]).length > 1 && (
                      <p className="font-medium text-sm">
                        {item[1].opens_at}-{item[1].closes_at}
                      </p>
                    )}
                    {Object.keys(item[1]).length === 1 && (
                      <p className="font-medium text-sm">Closed</p>
                    )}
                  </div>
                );
              })}
            </div> */}
          </div>
        </TabsContent>
        <TabsContent value="reviews">
          <div className="p-4 flex flex-wrap justify-between gap-4 w-full">
            <div className="w-full">
              <h1 className="text-2xl font-semibold text-secondary">
                Recommended Reviews
              </h1>
              {singleShop?.rating.length === 0 && (
                <div className="mx-auto bg-primary-accent px-6 py-4 rounded-lg">
                  <h1 className="text-secondary text-center">
                    No Reviews Founds On {singleShop.name} Shop
                  </h1>
                </div>
              )}
              {singleShop?.rating?.map((item, index) => {
                return (
                  <div
                    key={index.toString()}
                    className="p-2 m-2 shadow-[0_4px_12px_rgba(0,0,0,0.650)] w-full rounded-md flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-center w-full ">
                      <h1 className="text-xl font-medium text-secondary">
                        {item.user ?? "Unknown"}
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
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ShopOffers({
  shopId,
  shopName,
}: {
  shopId: number;
  shopName: string;
}) {
  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.businessrouter.shopOffers.queryOptions({ businessId: shopId }),
  );
  return (
    <div className="p-4 flex flex-wrap justify-between gap-4">
      {data?.length === 0 && (
        <div className="mx-auto bg-primary-accent px-6 py-4 rounded-lg">
          <h1 className="text-secondary">
            No Offers Founds On {shopName} Shop
          </h1>
        </div>
      )}
      {data?.map((item, index) => (
        <div
          key={index.toString()}
          className="shadow-[0_4px_12px_rgba(0,0,0,0.650)] py-4 rounded-md hover:scale-101 transform transition-all duration-300 flex flex-col justify-between items-center lg:w-[30%] md:w-[45%] w-[95%]"
        >
          <Link
            href={{
              pathname: `/business/singleOffer/${item.id}`,
            }}
          >
            <div className="relative">
              <Image
                width={200}
                height={400}
                alt="offer image"
                src="https://www.justsearch.net.in/assets/images/6194461891759217396.png" // TODO : change image url when upload images to cloudinary
              />
              <span className="absolute z-1 top-3  w-[70px] bg-error text-end px-4 text-white rounded-r-md">
                -{item.discountPercent}%
              </span>
            </div>
          </Link>
          <h2 className="text-center font-medium line-clamp-2 px-4">
            {item.name}
          </h2>
          <h2>
            ₹ <span className="line-through">{item.price}</span>
          </h2>
          <h2 className="font-semibold text-primary">₹ {item.price}</h2>
        </div>
      ))}
    </div>
  );
}

function ShopProducts({shopId,shopName} : {shopId:number,shopName:string}){
    const trpc = useTRPC();
    const {data} = useQuery(trpc.businessrouter.shopProducts.queryOptions({businessId : shopId}))

    return (
      <div className="p-4 flex flex-wrap justify-between gap-4">
            {data?.length === 0 && (
              <div className="mx-auto bg-primary-accent px-6 py-4 rounded-lg">
                <h1 className="text-secondary">
                  No Product Founds On {shopName} Shop
                </h1>
              </div>
            )}
            {data?.map((item, index) => (
              <div
                key={index.toString()}
                className="shadow-[0_4px_12px_rgba(0,0,0,0.650)] py-4 rounded-md hover:scale-101 transform transition-all duration-300 flex flex-col justify-between items-center lg:w-[30%] md:w-[45%] w-[95%]"
              >
                <Link
                  href={{
                    pathname: `/business/singleProduct/${item.id}`,
                  }}
                >
                  <Image
                    width={200}
                    height={400}
                    className="rounded-md"
                    src="https://www.justsearch.net.in/assets/images/10922718251737465572.JPEG" // TODO : change image when upload on cloudinary
                    alt="product image"
                  />
                </Link>
                <h2 className="text-center font-medium p-2">{item.name}</h2>
                <h2 className="font-medium">
                  ₹ <span className="text-primary">{item.price}</span>
                </h2>
              </div>
            ))}
          </div>
    )
}