"use client";
import Image from "next/image";
import { MdLocationPin } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import type { OutputTrpcType } from "@/trpc/type";
import { Badge } from "@/components/ui/badge";
import Rating from "@/components/ui/Rating";
import Link from "next/link";

export type HireListing = {
  objectID: string;
  name: string;
  category: string;
  expectedSalary: number;
  gender: string;
  jobType: string[];
  languages: string[];
  subcategories: string[];
  buildingName?: string;
  workExp: number;
  workShift: string[];
  area?: string;
  phoneNumber?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  _geoloc: {
    lat: number;
    lng: number;
  };
};

export const HireListingCard = ({ item }: { item: HireListing }) => {
  return (
    <div className="mx-auto p-4">
      <div className="flex flex-col justify-center gap-4">
        <div className="p-4 flex flex-col md:flex-row gap-6 rounded-2xl shadow-[0_0_10px_0_rgba(0,0,0,0.40)] hover:scale-102 transition-all transform duration-300">
          <div className="mx-auto md:mx-0">
            <div className="relative max-w-[400px] mx-auto ">
              <Link
                href={{
                  pathname: `/hire/hireDetail/${item.objectID}`,
                }}
              >
                <Image
                  width={300}
                  height={300}
                  className="rounded-md object-cover"
                  alt="Bussiness Image"
                  src="https://www.justsearch.net.in/assets/images/2642394691738214177.jpg" // TODO : change image when upload on cloudinary
                />
              </Link>
            </div>
          </div>
          <div className="flex flex-col py-2 justify-between gap-2 ">
            <h1 className="text-2xl font-bold ">{item.name}</h1>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="default">{item.category}</Badge>

              {item.subcategories.slice(0, 2).map((subcategory, index) => (
                <Badge variant="destructive" key={index.toString()}>
                  {subcategory}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2 ">
              <MdLocationPin />
              <p className="text-sm">
                {item?.area} {item?.buildingName}
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 ">
              <Button
                onClick={() => {
                  console.log("chatting with", item.objectID);
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
                  console.log("calling on", item.phoneNumber ?? "9876543201");
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
