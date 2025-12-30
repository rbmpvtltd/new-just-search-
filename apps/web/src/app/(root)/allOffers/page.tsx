"use client";

// import {
//   InstantSearch,
//   SearchBox,
//   Hits,
//   Configure,
//   RangeInput,
//   ClearRefinements,
// } from "react-instantsearch";
// import { serverAlgolia } from "@repo/algolia";
// import React, { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";

// function Hit({ hit }: { hit: any }) {
//   console.log("hit is ", hit.categoryId);
//   return (
//     <div className="p-4 flex w-full flex-wrap justify-between gap-4">
//       <div className="shadow-[0_4px_12px_rgba(0,0,0,0.650)] py-4 rounded-md hover:scale-101 transform transition-all duration-300 flex flex-col justify-between items-center lg:w-[30%] md:w-[45%] w-[95%]">
//         <Link
//           href={{
//             pathname: hit.discountPercent
//               ? `/business/singleOffer/${hit.navigationId}`
//               : `/business/singleProduct/${hit.navigationId}`,
//           }}
//         >
//           <div className="relative">
//             <Image
//               width={200}
//               height={400}
//               alt="offer image"
//               src="https://www.justsearch.net.in/assets/images/6194461891759217396.png"
//             />
//             {hit.discountPercent && (
//               <span className="absolute z-1 top-3 w-[70px] bg-error text-end px-4 text-white rounded-r-md">
//                 -{hit.discountPercent}%
//               </span>
//             )}
//           </div>
//         </Link>
//         <h2 className="text-center font-medium line-clamp-2 px-4 w-full break-words">
//           {hit.name}
//         </h2>
//         {hit.discountPercent && (
//           <h2>
//             ₹ <span className="line-through">{hit.price}</span>
//           </h2>
//         )}
//         <h2 className="font-semibold text-primary">
//           ₹ {hit.finalPrice ?? hit.price}
//         </h2>
//       </div>
//     </div>
//   );
// }

// export default function AlgoliaSearch() {
//   const [discount, setDiscount] = useState(0);

//   return (
//     <InstantSearch
//       searchClient={serverAlgolia}
//       indexName="product_offer_listing"
//     >
//       <div className="search-container p-4">
//         <SearchBox
//           placeholder="Search Anything From Hires"
//           classNames={{
//             root: "w-full",
//             form: "flex items-center justify-between border border-black px-2 rounded",
//             input: "flex-1 outline-none py-2",
//             submit: "ml-2", // search icon button
//             reset: "ml-2", // clear icon button (optional)
//           }}
//         />

//         <Configure
//           analytics={false}
//           hitsPerPage={20}
//           filters={`discountPercent > ${discount}`}
//         />

//         <div className="content flex gap-4 mt-6">
//           {/* in sidebar ne apne according baad me manage karunga */}
//           <aside className="filters w-64 shadow-2xl sticky">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="font-bold text-2xl">Filters</h3>

//               <ClearRefinements
//                 classNames={{
//                   button:
//                     "text-sm px-2 py-1 border rounded bg-primary text-white",
//                 }}
//               >
//                 Clear All Filters
//               </ClearRefinements>
//             </div>

//             <div className="mb-6">
//               <h4 className="font-bold mb-2 text-sm lg:text-base">Price</h4>
//               <RangeInput
//                 attribute="price"
//                 classNames={{
//                   root: "flex flex-col gap-2",
//                   input:
//                     "border border-gray-300 px-2 py-1.5 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
//                   submit:
//                     "px-3 py-1 bg-primary text-white rounded text-sm mt-2",
//                 }}
//               />
//             </div>
//             <div className="mb-6">
//               <h4 className="font-bold mb-2 text-sm lg:text-base">
//                 Discount %
//               </h4>

//               <input
//                 type="range"
//                 min={1}
//                 max={100}
//                 value={discount}
//                 onChange={(e) => setDiscount(Number(e.target.value))}
//                 className="w-full my-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <div className="text-sm mt-1 text-gray-600">{discount}% </div>
//             </div>
//           </aside>

//           <main className="results  flex-1 w-[80%]">
//             <Hits hitComponent={Hit} />
//           </main>
//         </div>
//       </div>
//     </InstantSearch>
//   );
// }

import {
  InstantSearch,
  SearchBox,
  Hits,
  Configure,
  RangeInput,
  ClearRefinements,
  Pagination,
  RefinementList,
} from "react-instantsearch";
import { algoliaClient } from "@repo/algolia";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

function Hit({ hit }: { hit: any }) {
  return (
    <div className="shadow-[0_4px_12px_rgba(0,0,0,0.650)] py-4 rounded-md hover:scale-105 transform transition-all duration-300 flex flex-col justify-between items-center">
      <Link
        href={{
          pathname: hit.discountPercent
            ? `/subcategory/aboutBusiness/offers/singleOffers/${hit.navigationId}`
            : `/subcategory/aboutBusiness/products/singleProduct/${hit.navigationId}`,
        }}
        className="w-full"
      >
        <div className="relative w-full mx-auto flex justify-center">
          <div className="relative">
            <Image
              width={200}
              height={400}
              alt="offer image"
              src="https://www.justsearch.net.in/assets/images/6194461891759217396.png"
              className="object-contain"
            />
            {hit.discountPercent > 0 && (
              <span className="absolute z-10 top-3 left-0 min-w-[70px] bg-error text-end px-4 py-1 text-white rounded-r-md font-semibold text-sm">
                -{hit.discountPercent}%
              </span>
            )}
          </div>
        </div>
      </Link>
      <div className="w-full px-4 mt-3 space-y-2">
        <h2 className="text-center font-medium line-clamp-2 w-full break-words min-h-[3rem]">
          {hit.name}
        </h2>
        <div className="flex flex-col items-center gap-1">
          {hit.discountPercent > 0 && (
            <p className="text-gray-500 text-sm">
              ₹ <span className="line-through">{hit.price}</span>
            </p>
          )}
          <p className="font-bold text-primary text-lg">
            ₹ {hit.finalPrice > 0 ? hit.finalPrice : hit.price}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AlgoliaSearch() {
  const [discount, setDiscount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  return (
    <InstantSearch
      searchClient={algoliaClient}
      indexName="product_offer_listing"
    >
      <div className="search-container p-4 max-w-7xl mx-auto">
        {/* Search Box */}
        <SearchBox
          placeholder="Search Products & Offers"
          classNames={{
            root: "w-full mb-4",
            form: "flex items-center justify-between border border-black px-2 rounded",
            input: "flex-1 outline-none py-2",
            submit: "ml-2",
            reset: "ml-2",
          }}
        />

        {/* Mobile Filter Toggle */}
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden w-full mb-4 px-4 py-2 bg-primary text-white rounded-lg font-semibold"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        <Configure
          analytics={false}
          hitsPerPage={20}
          filters={
            discount > 0
              ? `(discountPercent >= ${discount} OR discountPercent = 0)`
              : ""
          }
        />

        <div className="content flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Sidebar Filters */}
          <aside
            className={`
              filters w-full lg:w-64 lg:sticky lg:top-4 lg:self-start
              bg-white shadow-lg rounded-lg p-4 lg:shadow-2xl
              ${showFilters ? "block" : "hidden lg:block"}
              max-h-[calc(100vh-100px)] overflow-y-auto
            `}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl lg:text-2xl">Filters</h3>
              <ClearRefinements
                classNames={{
                  button:
                    "text-xs lg:text-sm px-2 py-1 border rounded bg-primary text-white hover:bg-opacity-90 transition-colors",
                }}
              />
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <h4 className="font-bold mb-2 text-sm lg:text-base">
                Price Range
              </h4>
              <RangeInput
                attribute="price"
                classNames={{
                  root: "flex flex-col gap-2",
                  input:
                    "border border-gray-300 px-2 py-1.5 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                  submit:
                    "px-3 py-1 bg-primary text-white rounded text-sm mt-2 cursor-pointer hover:bg-opacity-90 transition-colors",
                }}
              />
            </div>

            {/* Discount Percentage Filter */}
            <div className="mb-6">
              <h4 className="font-bold mb-2 text-sm lg:text-base">
                Minimum Discount
              </h4>
              <input
                type="range"
                min={0}
                max={100}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">{discount}%</span>
                {discount > 0 && (
                  <button
                    type="button"
                    onClick={() => setDiscount(0)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            <div className="mb-6">
              <h4 className="font-bold mb-2 text-sm lg:text-base">Category</h4>
              <RefinementList
                attribute="category"
                limit={2}
                searchable={true}
                searchablePlaceholder="Search Category"
                showMore={true}
                classNames={{
                  item: "flex items-center gap-2 mb-1",
                  label: "flex items-center gap-2 text-sm cursor-pointer",
                  checkbox: "cursor-pointer",
                  count:
                    "ml-auto text-xs bg-secondary text-white rounded-md px-2 py-0.5",
                  showMore:
                    "text-blue-600 text-sm mt-2 cursor-pointer hover:underline",
                  searchBox:
                    "w-full my-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                }}
              />
            </div>

            <div className="mb-6">
              <h4 className="font-bold mb-2 text-sm lg:text-base">
                Subcategories
              </h4>
              <RefinementList
                attribute="subcategories"
                limit={2}
                searchable={true}
                searchablePlaceholder="Search Subcategories"
                showMore={true}
                classNames={{
                  item: "flex items-center gap-2 mb-1",
                  label: "flex items-center gap-2 text-sm cursor-pointer",
                  checkbox: "cursor-pointer",
                  count:
                    "ml-auto text-xs bg-secondary text-white rounded-md px-2 py-0.5",
                  showMore:
                    "text-blue-600 text-sm mt-2 cursor-pointer hover:underline",
                  searchBox:
                    "w-full my-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                }}
              />
            </div>
          </aside>

          {/* Main Results */}
          <main className="results flex-1 min-w-0">
            <Hits
              hitComponent={Hit}
              classNames={{
                root: "w-full",
                list: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
                item: "w-full",
              }}
            />

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <Pagination
                classNames={{
                  root: "flex gap-2 flex-wrap justify-center",
                  list: "flex gap-2 flex-wrap",
                  item: "inline-block",
                  link: "px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 text-sm lg:text-base transition-colors cursor-pointer",
                  selectedItem: "bg-primary text-white border-primary",
                  disabledItem: "opacity-50 cursor-not-allowed",
                  firstPageItem: "hidden sm:inline-block",
                  previousPageItem: "inline-block",
                  pageItem: "hidden sm:inline-block",
                  nextPageItem: "inline-block",
                  lastPageItem: "hidden sm:inline-block",
                }}
                showFirst={true}
                showLast={true}
                showPrevious={true}
                showNext={true}
                padding={2}
              />
            </div>
          </main>
        </div>
      </div>
    </InstantSearch>
  );
}
