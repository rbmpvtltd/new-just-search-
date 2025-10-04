"use client"
import { useState } from "react";
import AllCategory from "./AllCategory";
import { PopularCategoryCard } from "./PopularCategoryCard";
import type { OutputTrpcType } from "@/trpc/type";

type PopularCategoriesType = OutputTrpcType["categoryRouter"]["popularCategories"];
type AllCategoryType = OutputTrpcType["categoryRouter"]["allCategories"];


function Category({ category,allCategory }: {category :PopularCategoriesType|null,allCategory :AllCategoryType|null}) {
    const [isAllCategoryOpen, setIsAllCategoryOpen] = useState(false);
    
      const toggleAllCategory = () => {
        setIsAllCategoryOpen(!isAllCategoryOpen);
      };
  return (
    <>
      <div className="grid lg:grid-cols-8 md:grid-cols-4 grid-cols-2 mt-10  px-36 mx-auto gap-4 place-content-center">
        {category?.map((item, index: number) => {
          return (
            <PopularCategoryCard
              key={index.toString()}
              photo={item.photo}
              title={item.title}
              id={item.id}
            />
          );
        })}
        <button
          type="button"
          onClick={toggleAllCategory}
          className="max-w-[100px] mb-4 flex flex-col items-center justify-center border-2 rounded-2xl hover:scale-105 transform transition-all duration-200 hover:shadow-2xl bg-amber-600 text-white font-extrabold px-2"
        >
          Show More
        </button>
      </div>
      <div className="overflow-x-hidden">
        <AllCategory
          isOpen={isAllCategoryOpen}
          setIsOpen={setIsAllCategoryOpen}
          data={allCategory}
        />
      </div>
    </>
  );
}

export default Category;
