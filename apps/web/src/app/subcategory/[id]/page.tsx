"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import Image from "next/image";
import { MdLocationPin } from "react-icons/md";
import { FaStar, FaPhoneAlt } from "react-icons/fa";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { getPagination } from "@/utils/getPagination";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function Subcategory({ params }: { params: { id: string } }) {
  const { id } = params;
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 2);
  console.log("==================>",page)
  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.subcategoryRouter.subcategory.queryOptions({
      categoryId: Number(id),
      page: page,
      limit: 10,
    }),
  );
  
  console.log(data);

  const pagination = getPagination(data?.page,data?.totalPages)

  return (
    <div className="mx-auto flex p-4">
      <div className="p-4 rounded-2xl shadow-[0_0_10px_0_rgba(0,0,0,0.40)] hover:scale-101 transition-all transform duration-300">
        <div>
          <Image
            width={300}
            height={300}
            className="rounded-md"
            alt="Bussiness Image"
            src="https://www.justsearch.net.in/assets/images/2642394691738214177.jpg"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold p-2">Abhipri</h1>
          <div className="flex gap-4 p-2">
            <p className="bg-orange-300 py-1 px-3 rounded-md">Garments</p>
            <p className="bg-orange-300 py-1 px-3 rounded-md">Formal Wear</p>
          </div>
          <div className="flex items-center gap-2 p-2">
            <MdLocationPin />
            <p className="text-sm">
              163, near Circuit House Road,, Ajit Colony,
            </p>
          </div>
          <div className="flex items-center gap-2 p-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <FaStar className="text-yellow-300" key={index.toString()} />
            ))}
          </div>
          <div className="flex flex-col gap-4 items-center">
            <div className="flex items-center gap-2 bg-amber-600 w-[90%] text-center py-2 rounded-lg">
              <p className="mx-auto flex items-center text-white font-semibold gap-2">
                <MdLocationPin />
                Get Direction
              </p>
            </div>
            <div className="flex items-center gap-2 bg-amber-600 w-[90%] text-center py-2 rounded-lg">
              <p className="mx-auto flex items-center text-white font-semibold gap-2">
                <IoChatbubbleEllipses />
                Chat Now
              </p>
            </div>
            <div className="flex items-center gap-2 bg-amber-600 w-[90%] text-center py-2 rounded-lg">
              <p className="mx-auto flex items-center text-white font-semibold gap-2">
                <FaPhoneAlt />
                Contact Now
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        {pagination.map((item,index)=>{
           if (item === '...') {
            return (
              <span key={index.toString()} className="px-3 py-1 text-gray-400 cursor-default">
                {item}
              </span>
            );
          }
          return (
           <Link  href={{
            pathname: `/subcategory/${id}`,
            query: { page: item }, 
          }} key={index.toString()}>{item}</Link> 
          )
        })}
      </div>
    </div>
  );
}

export default Subcategory;
