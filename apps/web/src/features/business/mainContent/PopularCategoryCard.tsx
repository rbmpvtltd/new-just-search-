"use client";
import Link from "next/link";
import { CldImage } from "next-cloudinary";

export function PopularCategoryCard({
  photo,
  title,
  id,
  type,
}: {
  photo: string | null;
  title: string;
  id: number;
  type: number;
}) {
  return (
    <div className="min-h-20 mb-4 max-w-25 flex flex-col items-center justify-evenly border-2 rounded-2xl hover:scale-105 transform transition-all duration-300 hover:shadow-xl hover:border-amber-600">
      <Link
        href={{
          pathname: type === 1 ? `/subcategory/${id}` : `/hire`,
          query:
            type === 1
              ? { page: 1 }
              : { categoryId: id },
        }}
        className="flex items-center justify-center flex-col"
      >
        <CldImage
          width={40}
          height={50}
          alt="category image"
          src={photo ?? ""}
          className="mx-auto h-11"
        />
        <p className="w-full text-center mx-auto text-[10px] md:line-clamp-2 line-clamp-1">
          {title}
        </p>
      </Link>
    </div>
  );
}
