"use client";
import type { OutputTrpcType } from "@/trpc/type";
import { CldImage } from "next-cloudinary";
import { useState } from "react";
import AllCategory from "./AllCategory";

type PopularBannerType =
  | OutputTrpcType["categoryRouter"]["popularBannerCategory"]
  | null;

type AllCategoryType = OutputTrpcType["categoryRouter"]["allCategories"] | null;

function PopularaBanner({
  popularCategories,
  allCategories,
}: {
  popularCategories: PopularBannerType;
  allCategories: AllCategoryType;
}) {
  const [categoryType, setCategoryType] = useState<1 | 2>(2);
  const [isAllCategoryOpen, setIsAllCategoryOpen] = useState<boolean>(false);

  return (
    <div className="">
      <div className="flex flex-col mx-auto sm:mx-0 sm:flex-row justify-between lg:w-[60%] w-[90%]  gap-4 m-5 px-12">
        <h1 className="text-2xl font-semibold text-center">Popular On Just <span className="text-primary"> Search</span></h1>
        <div className="flex gap-4 mx-auto sm:mx-0">
          <button
            onClick={() => setCategoryType(2)}
            type="button"
            className={`${categoryType === 2 ? "bg-primary text-white" : ""}   px-4 text-[13px] rounded-sm border-2 border-primary transition-all transform duration-500 cursor-pointer`}
          >
            Hire
          </button>
          <button
            onClick={() => setCategoryType(1)}
            type="button"
            className={`${categoryType === 1 ? "bg-primary text-white" : ""}  px-4 text-[13px] rounded-sm border-2 border-primary transition-all transform duration-500 cursor-pointer`}
          >
            Business
          </button>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap justify-center">
        {popularCategories
          ?.filter((item) => Number(item.type) === categoryType)
          ?.map((item, index) => {
            return (
              <div
                key={index.toString()}
                className="w-[70%] lg:w-[22%] border-2 border-primary rounded-md flex flex-col justify-between items-center py-2 h-80"
              >
                <CldImage
                  height={270}
                  width={270}
                  src={item.photo}
                  alt={`${item.title} category image`}
                  className="h-70 object-cover"
                />
                <p className="font-semibold">{item.title}</p>
              </div>
            );
          })}
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => setIsAllCategoryOpen(!isAllCategoryOpen)}
          type="button"
          className="text-primary px-12 py-2 font-semibold"
        >
          Explore
        </button>
      </div>
      <div className="overflow-x-hidden">
        <AllCategory
          isOpen={isAllCategoryOpen}
          setIsOpen={setIsAllCategoryOpen}
          data={allCategories}
          type={categoryType}
        />
      </div>
    </div>
  );
}

export default PopularaBanner;
