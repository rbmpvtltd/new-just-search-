// "use client";

// import Link from "next/link";
// import { CldImage } from "next-cloudinary";
// import { IoCloseCircleOutline } from "react-icons/io5";
// import { useState } from "react";

// interface AllCategoryProps {
//   isOpen: boolean;
//   setIsOpen: (value: boolean) => void;
//   data:
//   | {
//     photo: string;
//     title: string;
//     type: number | null;
//     id: string | number;
//   }[]
//   | null;
//   type?: 1 | 2 | 0;
// }

// function smartMatch(a: string, b: string) {
//   a = a.toLowerCase();
//   b = b.toLowerCase();

//   if(b.length < 3){
//     return a.toLowerCase().startsWith(b.toLowerCase()) || a.toLowerCase().endsWith(b.toLowerCase());
//   }

//   for (let n = 3; n <= 4; n++) {
//     if (
//       a.slice(0, n) === b.slice(0, n) ||
//       a.slice(-n) === b.slice(-n)
//     ) {
//       return true;
//     }
//   }

//   return false;
// }

// function AllCategory({ isOpen, setIsOpen, data, type = 0 }: AllCategoryProps) {
//   const [searchQuery, setSearchQuery] = useState("");

//   const filteredData = data
//     ?.filter((item) => {
//       if (type === 0) return true;
//       return Number(item.type) === type;
//     })
//     .filter((item) => {
//       if (searchQuery === "") return true;

//       return smartMatch(item.title, searchQuery);
//     });

//   return (
//     <div
//       className={`fixed top-0 shadow-2xl right-0 h-full w-[90%] bg-white z-50 transform transition-transform duration-700 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//     >
//       <div className="p-4 flex justify-between items-center">
//         <h2 className="text-2xl font-bold">All Categories</h2>
//         <input
//           type="text"
//           className="w-[40%] md:w-[60%] lg:w-[70%] px-4 py-2 border-2 focus:border-gray-600 rounded-lg"
//           placeholder="Search Category"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         <IoCloseCircleOutline
//           className="text-2xl text-amber-600 font-bold cursor-pointer"
//           onClick={() => setIsOpen(false)}
//         />
//       </div>
//       <div
//         className="px-8 pb-8  overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
//       >
//         {filteredData?.map(
//           (
//             item: { photo: string; title: string; id: number | string },
//             index: number,
//           ) => (
//             <Link
//               key={index.toString()}
//               href={{
//                 pathname: `/subcategory/${item.id}`,
//                 query: { page: 1 },
//               }}
//               className="flex items-center gap-4 mb-4 cursor-pointer"
//             >
//               <CldImage
//                 height={30}
//                 width={30}
//                 src={item.photo}
//                 alt={`${item.title} category image`}
//                 className="object-cover"
//               />
//               <p className="text-sm">{item.title}</p>
//             </Link>
//           ),
//         )}
//       </div>
//     </div>
//   );
// }

// export default AllCategory;

// "use client";

// import Link from "next/link";
// import { CldImage } from "next-cloudinary";
// import { IoCloseCircleOutline } from "react-icons/io5";
// import { useState } from "react";

// interface AllCategoryProps {
//   isOpen: boolean;
//   setIsOpen: (value: boolean) => void;
//   data:
//     | {
//         photo: string;
//         title: string;
//         type: number | null;
//         id: string | number;
//       }[]
//     | null;
//   type?: 1 | 2 | 0;
// }

// function smartMatch(a: string, b: string) {
//   a = a.toLowerCase();
//   b = b.toLowerCase();

//   if (b.length < 3) {
//     return (
//       a.toLowerCase().startsWith(b.toLowerCase()) ||
//       a.toLowerCase().endsWith(b.toLowerCase())
//     );
//   }

//   for (let n = 3; n <= 4; n++) {
//     if (a.slice(0, n) === b.slice(0, n) || a.slice(-n) === b.slice(-n)) {
//       return true;
//     }
//   }

//   return false;
// }

// function AllCategory({ isOpen, setIsOpen, data, type = 0 }: AllCategoryProps) {
//   const [searchQuery, setSearchQuery] = useState("");

//   const filteredData = data
//     ?.filter((item) => {
//       if (type === 0) return true;
//       return Number(item.type) === type;
//     })
//     .filter((item) => {
//       if (searchQuery === "") return true;

//       return smartMatch(item.title, searchQuery);
//     });

//   const handleClose = () => setIsOpen(false);

//   return (
//     <>
//       {/* Backdrop */}
//       <button
//         type="button"
//         className={`fixed inset-0 bg-black transition-opacity duration-700 z-40 ${
//           isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
//         }`}
//         onClick={handleClose}
//         aria-label="Close category panel"
//         tabIndex={isOpen ? 0 : -1}
//       />

//       {/* Panel */}
//       <div
//         className={`fixed top-0 shadow-2xl right-0 h-full w-[90%] bg-white z-50 transform transition-transform duration-700 ease-in-out ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         <div className="p-4 flex justify-between items-center">
//           <h2 className="text-2xl font-bold">All Categories</h2>
//           <input
//             type="text"
//             className="w-[40%] md:w-[60%] lg:w-[70%] px-4 py-2 border-2 focus:border-gray-600 rounded-lg"
//             placeholder="Search Category"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           <IoCloseCircleOutline
//             className="text-2xl text-amber-600 font-bold cursor-pointer"
//             onClick={handleClose}
//           />
//         </div>
//         <div className="px-8 pb-8  overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//           {filteredData?.map(
//             (
//               item: { photo: string; title: string; id: number | string },
//               index: number,
//             ) => (
//               <Link
//                 key={index.toString()}
//                 href={{
//                   pathname: `/subcategory/${item.id}`,
//                   query: { page: 1 },
//                 }}
//                 className="flex items-center gap-4 mb-4 cursor-pointer"
//               >
//                 <CldImage
//                   height={30}
//                   width={30}
//                   src={item.photo}
//                   alt={`${item.title} category image`}
//                   className="object-cover"
//                 />
//                 <p className="text-sm">{item.title}</p>
//               </Link>
//             ),
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// export default AllCategory;

"use client";

import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useState, useEffect } from "react";

interface AllCategoryProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  data:
  | {
    photo: string;
    title: string;
    type: number | null;
    id: string | number;
  }[]
  | null;
  type?: 1 | 2 | 0;
}
function AllCategory({ isOpen, setIsOpen, data, type = 0 }: AllCategoryProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const filteredData = data
    ?.filter((item) => {
      if (type === 0) return true;
      return Number(item.type) === type;
    })
    .filter((item) => {
      if (searchQuery === "") return true;
      return item.title.toLowerCase().startsWith(searchQuery.toLowerCase())
    });

  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        className={`fixed inset-0 bg-black transition-opacity duration-700 z-40 ${isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
          }`}
        onClick={handleClose}
        aria-label="Close category panel"
        tabIndex={isOpen ? 0 : -1}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 shadow-2xl right-0 h-full w-[90%] bg-white z-50 transform transition-transform duration-700 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">All Categories</h2>
          <input
            type="text"
            className="w-[40%] md:w-[60%] lg:w-[70%] px-4 py-2 border-2 focus:border-gray-600 rounded-lg"
            placeholder="Search Category"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <IoCloseCircleOutline
            className="text-2xl text-amber-600 font-bold cursor-pointer"
            onClick={handleClose}
          />
        </div>
        <div className="px-8 pb-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredData?.map(
            (
              item: { photo: string; title: string; id: number | string },
              index: number,
            ) => (
              <Link
                key={index.toString()}
                href={{
                  pathname: type === 1 ? `/subcategory/${item.id}` : `/hire`,
                  query:
                    type === 1
                      ? { page: 1 }
                      : { categoryId: item.id },
                }}
                className="flex items-center justify-center flex-col"
              >
                <CldImage
                  height={30}
                  width={30}
                  src={item.photo}
                  alt={`${item.title} category image`}
                  className="object-cover"
                />
                <p className="text-sm">{item.title}</p>
              </Link>
            ),
          )}
        </div>
      </div>
    </>
  );
}

export default AllCategory;