"use client";
import { CldImage } from "next-cloudinary";
import Link from "next/link";

export function PopularCategoryCard({
  photo,
  title,
  id,
}: {
  photo: string | null;
  title: string;
  id: number;
}) {
  return (
    <div className="min-h-[80px] mb-4 max-w-[100px] flex flex-col items-center justify-evenly border-2 rounded-2xl hover:scale-105 transform transition-all duration-300 hover:shadow-xl hover:border-amber-600">
      <Link
        href={{
          pathname: `/business/listings/${id}`,
          query: { page: 1 }, 
        }}
        className="flex items-center justify-center flex-col"
      >
        <CldImage
          width={40}
          height={50}
          alt="category image"
          src={photo ?? ""}
          className="mx-auto"
        />
        <p className="w-[70%] text-center mx-auto text-[10px]">{title}</p>
      </Link>
    </div>
  );
}
