"use client";

import { CldImage } from "next-cloudinary";
import { IoCloseCircleOutline } from "react-icons/io5";

interface AllCategoryProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  data: { photo: string; title: string; type: number | null }[] | null;
  type?: 1 | 2 | 0;
}

function AllCategory({ isOpen, setIsOpen, data, type = 0 }: AllCategoryProps) {
  return (
    <div
      className={`fixed top-0 shadow-2xl right-0 h-full w-[90%] bg-white z-50 transform transition-transform duration-700 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">All Categories</h2>
        <input
          type="text"
          className="w-[40%] md:w-[60%] lg:w-[70%] px-4 py-2 border-2 focus:border-gray-600 rounded-lg"
          placeholder="Search Category"
        />
        <IoCloseCircleOutline
          className="text-2xl text-amber-600 font-bold cursor-pointer"
          onClick={() => setIsOpen(false)}
        />
      </div>
      <div className="px-8 pb-8 h-[calc(100%-80px)] overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {data
          ?.filter((item) => {
            if(item.type === 0) return true
            return Number(item.type) === type
          })
          .map((item: { photo: string; title: string }, index: number) => {
            return (
              <div
                key={index.toString()}
                className="flex items-center gap-4 mb-4 cursor-pointer"
              >
                <CldImage
                  height={30}
                  width={30}
                  src={item.photo}
                  alt={`${item.title} category image`}
                  className="object-cover"
                />
                <p className="text-sm">{item.title}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default AllCategory;
