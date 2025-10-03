"use client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import Image from "next/image";
import { MdLocationPin } from "react-icons/md";
import { FaStar, FaPhoneAlt } from "react-icons/fa";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { getPagination } from "@/utils/getPagination";
import { useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

function Subcategory({ params }: { params: { id: string } }) {
  const { id } = params;
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 2);
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.subcategoryRouter.subcategory.queryOptions({
      categoryId: Number(id),
      page: page,
      limit: 10,
    }),
  );

  if (isLoading) {
    return (
      <div className="mx-auto p-4 flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index.toString()}
            className="p-4 flex gap-6 rounded-2xl shadow-[0_0_10px_0_rgba(0,0,0,0.40)] animate-pulse"
          >
            {/* Image */}
            <Skeleton className="w-72 h-72 rounded-md bg-amber-100" />

            {/* Right content */}
            <div className="flex flex-col py-2 justify-between flex-1">
              {/* Business name */}
              <Skeleton className="h-8 w-1/2 rounded-md mb-2 bg-amber-100" />

              {/* Category + Subcategories */}
              <div className="flex gap-2 flex-wrap mb-2">
                <Skeleton className="h-6 w-20 rounded-md bg-amber-100" />
                <Skeleton className="h-6 w-20 rounded-md bg-amber-100" />
              </div>

              {/* Location */}
              <Skeleton className="h-4 w-3/4 rounded-md mb-2 bg-amber-100" />

              {/* Stars */}
              <div className="flex gap-2 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton
                    key={i.toString()}
                    className="h-4 w-4 rounded-full bg-amber-100"
                  />
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <Skeleton className="h-10 w-1/3 rounded-lg bg-amber-100" />
                <Skeleton className="h-10 w-1/3 rounded-lg bg-amber-100" />
                <Skeleton className="h-10 w-1/3 rounded-lg bg-amber-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const pagination = getPagination(data?.page, data?.totalPages);

  return (
    <div className="mx-auto p-4">
      <div className="flex flex-col gap-4">
        {data?.data.map((item, index) => {
          return (
            <div
              key={index.toString()}
              className="p-4 flex gap-6 rounded-2xl shadow-[0_0_10px_0_rgba(0,0,0,0.40)] hover:scale-102 transition-all transform duration-300"
            >
              <div>
                <Image
                  width={300}
                  height={300}
                  className="rounded-md"
                  alt="Bussiness Image"
                  src="https://www.justsearch.net.in/assets/images/2642394691738214177.jpg"
                />
              </div>
              <div className="flex flex-col py-2 justify-between">
                <h1 className="text-2xl font-bold ">{item?.name}</h1>
                <div className="flex gap-2 flex-wrap">
                  <p className="bg-blue-300 my-auto px-2 py-1 rounded-md text-sm">
                    {item.category}
                  </p>

                  {item.subcategories.slice(0, 2).map((subcategory, index) => (
                    <p
                      key={index.toString()}
                      className="bg-pink-200 my-auto px-2 py-1 rounded-md text-sm"
                    >
                      {subcategory}
                    </p>
                  ))}
                </div>
                <div className="flex items-center gap-2 ">
                  <MdLocationPin />
                  <p className="text-sm">
                    {item?.area} {item?.streetName} {item?.buildingName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <FaStar
                      className="text-yellow-300 text-xl"
                      key={index.toString()}
                    />
                  ))}
                </div>
                <div className="flex gap-4 items-center">
                  <div className="tems-center gap-2 bg-amber-600 w-full text-center py-2 px-4 rounded-lg hover:scale-105 transition-all transform duration-300">
                    <button
                    onClick={()=>{
                      console.log("clicked",item.latitude,item.longitude)
                    }}
                      type="button"
                      className="mx-auto whitespace-nowrap flex items-center text-white font-semibold gap-2"
                    >
                      <MdLocationPin />
                      Get Direction
                    </button>
                  </div>
                  <div className="flex items-center gap-2 bg-amber-600 w-full text-center py-2 px-4 rounded-lg hover:scale-105 transition-all transform duration-300">
                    <button
                    onClick={()=>{
                      console.log("chatting with",item.id)
                    }}
                      type="button"
                      className="mx-auto whitespace-nowrap flex items-center text-white font-semibold gap-2"
                    >
                      <IoChatbubbleEllipses />
                      Chat Now
                    </button>
                  </div>
                  <div className="flex items-center gap-2 bg-amber-600 w-full text-center py-2 px-4 rounded-lg hover:scale-105 transition-all transform duration-300">
                    <button
                    onClick={()=>{
                      console.log("calling on",item.phoneNumber)
                    }}
                      type="button"
                      className="mx-auto flex whitespace-nowrap items-center text-white font-semibold gap-2"
                    >
                      <FaPhoneAlt />
                      Contact Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={{
                  pathname: `/subcategory/${id}`,
                  query: { page: page - 1 },
                }}
              />
            </PaginationItem>
            {pagination.map((item, index) => {
              if (item === "...") {
                return (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
              return (
                <PaginationItem
                  key={index.toString()}
                  className={item === page ? "border-2 border-amber-600" : ""}
                >
                  <PaginationLink
                    href={{
                      pathname: `/subcategory/${id}`,
                      query: { page: item },
                    }}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                href={{
                  pathname: `/subcategory/${id}`,
                  query: { page: page + 1 },
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export default Subcategory;
