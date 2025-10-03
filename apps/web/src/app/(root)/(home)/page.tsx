"use client";
import FirstCaraousel from "@/components/mainContent/BannerFistCaraousel";
import { PopularCategoryCard } from "@/components/mainContent/PopularCategoryCard";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import AllCategory from "@/components/mainContent/AllCategory";
import { useState } from "react";

export default function Page() {
  // const token = await getToken();
  const [isAllCategoryOpen, setIsAllCategoryOpen] = useState(false);

  const toggleAllCategory = () => {
    setIsAllCategoryOpen(!isAllCategoryOpen);
  };
  const trpc = useTRPC();
  const { data: bannerFirst } = useQuery(
    trpc.banners.firstBanner.queryOptions(),
  );
  const { data: category } = useQuery(
    trpc.categoryRouter.popularCategories.queryOptions(),
  );
  const { data: allCategory } = useQuery(
    trpc.categoryRouter.allCategories.queryOptions(),
  );
  return (
    <div className="mx-auto">
      <FirstCaraousel bannerFirst={bannerFirst} />
      <div className="grid lg:grid-cols-8 md:grid-cols-4 grid-cols-2 mt-10  px-36 mx-auto gap-4 place-content-center">
        {category?.map(
          (item, index: number) => {
            return (
              <PopularCategoryCard
                key={index.toString()}
                photo={item.photo}
                title={item.title}
                id={item.id}
              />
            );
          },
        )}
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
    </div>
  );
}
