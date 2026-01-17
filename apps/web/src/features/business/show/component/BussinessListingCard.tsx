"use client";
import Image from "next/image";
import Link from "next/link";
// import Favourite from "../../shared/Favourite";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { FaPhoneAlt } from "react-icons/fa";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { MdLocationPin } from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Rating from "@/components/ui/Rating";
import type { OutputTrpcType } from "@/trpc/type";
import Favourite from "../../shared/Favourite";

type BusinessListing = {
  objectID: string;
  name: string;
  category: string;
  categoryId: number;
  rating: string;
  subcategories: string[];
  photo: string;
  area: string;

  longitude: string;
  latitude: string;

  buildingName: string;
  phoneNumber: string;
  streetName: string;

  _geoloc: {
    lat: number;
    lng: number;
  };
};
type businesses =
  OutputTrpcType["businessrouter"]["favouritesShops"]["data"][0]["shop"][0];

export const BussinessListingCard = ({
  item,
  navigationId,
  category,
  subcategory,
  rating,
}: {
  item: BusinessListing | businesses;
  navigationId?: number;
  category?: string;
  subcategory?: string[];
  rating?: string | undefined;
}) => {
  const router = useRouter();
  return (
    <div className="mx-auto p-4">
      <div className="flex flex-col justify-center gap-4">
        <div className="p-4 flex flex-col md:flex-row gap-6 rounded-2xl shadow-[0_0_10px_0_rgba(0,0,0,0.40)] hover:scale-102 transition-all transform duration-300">
          <div className="mx-auto md:mx-0">
            <div className="relative max-w-100 mx-auto ">
              <Link
                href={{
                  pathname: `/subcategory/aboutBusiness/${navigationId}`,
                }}
              >
                <CldImage
                  width="300"
                  height="300"
                  className="h-70 object-cover"
                  src={item.photo ?? ""}
                  alt="Business image"
                />
              </Link>
              {/* <div className="absolute top-2 right-2 bg-primary rounded-full pt-2 px-2">
                <Favourite
                  businessId={Number(item.id)}
                  initialFav={initialFav ?? false}
                />
              </div> TODO: navigate to single shop when trying clicked on favourite */}
            </div>
          </div>
          <div className="flex flex-col py-2 mt-4 gap-4 ">
            <h1 className="text-2xl font-bold ">{item.name}</h1>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="default">{category}</Badge>

              {subcategory
                ?.slice(0, 2)
                ?.map((subcategory: string, index: number) => (
                  <Badge variant="destructive" key={index.toString()}>
                    {subcategory}
                  </Badge>
                ))}
            </div>
            <div className="flex items-center gap-2 ">
              <MdLocationPin />
              <p className="text-sm">
                {item?.area} {item?.streetName} {item?.buildingName}
              </p>
            </div>
            <Rating rating={Math.ceil(Number(rating))} />
            <div className="flex flex-col md:flex-row gap-4 ">
              <Button
                onClick={() => {
                  router.push(`/subcategory/aboutBusiness/${navigationId}`);
                  console.log("clicked", item.latitude, item.longitude);
                }}
                type="button"
                className=" whitespace-nowrap flex items-center text-white font-semibold gap-2 hover:scale-105 transition-all transform duration-300"
              >
                <MdLocationPin />
                Get Direction
              </Button>
              <Button
                onClick={() => {
                  router.push(`/subcategory/aboutBusiness/${navigationId}`);
                  console.log("chatting with", navigationId);
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
                  router.push(`/subcategory/aboutBusiness/${navigationId}`);
                  console.log("calling on", item.phoneNumber);
                }}
                type="button"
                className="flex whitespace-nowrap items-center text-white font-semibold gap-2 hover:scale-105 transition-all transform duration-300"
              >
                <FaPhoneAlt />
                Contact Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
