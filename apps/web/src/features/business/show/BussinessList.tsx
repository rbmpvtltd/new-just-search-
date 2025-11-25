"use client";

import {
  InstantSearch,
  SearchBox,
  Hits,
  RefinementList,
  Configure,
  ClearRefinements,
  Pagination,
} from "react-instantsearch";
import { serverAlgolia } from "@repo/algolia";
import { useState, useEffect, useRef } from "react";
import { BussinessListingCard } from "@/features/business/show/component/BussinessListingCard";

function Hit({ hit }: { hit: any }) {
  return (
    <BussinessListingCard
      item={hit}
      rating={hit.rating}
      category={hit.category}
      subcategory={hit.subcategory}
    />
  );
}

export default function BussinessList({ categoryId }: { categoryId: number }) {
  const lat = useRef<number | null>(null);
  const lng = useRef<number | null>(null);
  const [radiusKm, setRadiusKm] = useState(10000);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        lat.current = pos.coords.latitude;
        lng.current = pos.coords.longitude;
      },
      () => {
        console.log("Location permission denied");
      }
    );
  }, []);

  return (
    <InstantSearch searchClient={serverAlgolia} indexName="business_listing">
      <div className="search-container p-4 max-w-7xl mx-auto">
        <SearchBox
          placeholder="Search Businesses"
          classNames={{
            root: "w-full mb-4",
            form: "flex items-center justify-between border border-black px-2 rounded",
            input: "flex-1 outline-none py-2",
            submit: "ml-2",
            reset: "ml-2",
          }}
        />

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
          filters={`categoryId:${categoryId}`}
          {...(lat.current && lng.current
            ? {
                aroundLatLng: `${lat.current},${lng.current}`,
                aroundRadius: radiusKm * 1000,
              }
            : {})}
        />

        <div className="content flex flex-col lg:flex-row gap-4 lg:gap-6">
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
                  button: "text-xs lg:text-sm px-2 py-1 border rounded bg-primary text-white",
                }}
              />
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
                  count: "ml-auto text-xs bg-secondary text-white rounded-md px-2 py-0.5",
                  showMore: "text-blue-600 text-sm mt-2 cursor-pointer hover:underline",
                  searchBox: "w-full my-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                }}
              />
            </div>

            <div className="mb-6">
              <h4 className="font-bold mb-2 text-sm lg:text-base">Rating</h4>
              <RefinementList
                attribute="rating"
                limit={2}                
                searchablePlaceholder="Search Rating"
                showMore={true}
                classNames={{
                  item: "flex items-center gap-2 mb-1",
                  label: "flex items-center gap-2 text-sm cursor-pointer",
                  checkbox: "cursor-pointer",
                  count: "ml-auto text-xs bg-secondary text-white rounded-md px-2 py-0.5",
                  showMore: "text-blue-600 text-sm mt-2 cursor-pointer hover:underline",
                }}
              />
            </div>

            <div className="mb-6">
              <h4 className="font-bold mb-2 text-sm lg:text-base">Subcategories</h4>
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
                  count: "ml-auto text-xs bg-secondary text-white rounded-md px-2 py-0.5",
                  showMore: "text-blue-600 text-sm mt-2 cursor-pointer hover:underline",
                  searchBox: "w-full my-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                }}
              />
            </div>

            {/* Distance Filter */}
            <div className="mb-6">
              <h4 className="font-bold mb-2 text-sm lg:text-base">Distance</h4>
              <input
                type="range"
                min={1}
                max={10000}
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="text-sm mt-1 text-gray-600">{radiusKm} km</div>
            </div>
          </aside>

          {/* Main Results */}
          <main className="results flex-1 min-w-0">
            <Hits
              hitComponent={Hit}
              classNames={{
                list: "grid grid-cols-1 gap-4",
              }}
            />

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <Pagination
                classNames={{
                  root: "flex gap-2 flex-wrap justify-center",
                  list: "flex gap-2 flex-wrap",
                  item: "inline-block",
                  link: "px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 hover:text-primary text-sm lg:text-base transition-colors",
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
// "use client";

// import {
//   InstantSearch,
//   SearchBox,
//   Hits,
//   RefinementList,
//   Configure,
//   RangeInput,
//   ClearRefinements,
//   Pagination,
// } from "react-instantsearch";
// import { serverAlgolia } from "@repo/algolia";
// import React, { useState, useEffect, useRef } from "react";
// import { HireListingCard } from "@/features/hire/show/component/HireListingCard";
// import { BussinessListingCard } from "@/features/business/show/component/BussinessListingCard";

// function Hit({ hit }: { hit: any }) {
//   console.log("hit is ", hit.categoryId);
//   return (
//     <BussinessListingCard
//       item={hit}
//       rating={hit.rating}
//       category={hit.category}
//       subcategory={hit.subcategory}
//     />
//   );
// }

// export default function BussinessList({ categoryId }: { categoryId: number }) {
//   const lat = useRef<number | null>(null);
//   const lng = useRef<number | null>(null);
//   const [radiusKm, setRadiusKm] = useState(10); // default 10 km

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         lat.current = pos.coords.latitude;
//         lng.current = pos.coords.longitude;
//       },
//       () => {
//         console.log("Location permission denied");
//       },
//     );
//   }, []);

//   return (
//     <InstantSearch searchClient={serverAlgolia} indexName="business_listing">
//       <div className="search-container p-4 md:p-6 lg:p-8">
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
//           filters={`categoryId:${categoryId}`}
//           {...(lat.current && lng.current
//             ? {
//                 aroundLatLng: `${lat.current},${lng.current}`,
//                 aroundRadius: radiusKm * 1000,
//               }
//             : {})}
//         />

//         <div className="content flex flex-col lg:flex-row gap-4 mt-6">
//           {/* in sidebar ne apne according baad me manage karunga */}
//           <aside className="filters w-full lg:w-64 shadow-2xl sticky top-0">
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

//             <h4 className="font-bold mb-2 mt-4">Category</h4>
//             <RefinementList
//               attribute="category"
//               limit={2}
//               searchable={true}
//               searchablePlaceholder="Search Category"
//               showMore={true}
//               classNames={{
//                 item: "flex items-center gap-3", // whole row
//                 label: "flex items-center gap-2", // label + checkbox
//                 checkbox: "mr-2 my-2 text-primary", // checkbox right side spacing
//                 count: "ml-3 text-sm bg-secondary text-white rounded-md px-1", // count spacing and style
//                 showMore: "text-blue-800",
//                 searchBox:
//                   "w-full max-w-md my-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
//               }}
//             />
//             <h4 className="font-bold mb-2 mt-4">Category</h4>
//             <RefinementList
//               attribute="rating"
//               limit={2}
//               searchable={true}
//               searchablePlaceholder="Search Category"
//               showMore={true}
//               classNames={{
//                 item: "flex items-center gap-3", // whole row
//                 label: "flex items-center gap-2", // label + checkbox
//                 checkbox: "mr-2 my-2 text-primary", // checkbox right side spacing
//                 count: "ml-3 text-sm bg-secondary text-white rounded-md px-1", // count spacing and style
//                 showMore: "text-blue-800",
//                 searchBox:
//                   "w-full max-w-md my-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
//               }}
//             />
//             <h4 className="font-bold mb-2 mt-4">Subcategories</h4>
//             <RefinementList
//               attribute="subcategories"
//               limit={2}
//               searchable={true}
//               searchablePlaceholder="Search Subcategories"
//               showMore={true}
//               classNames={{
//                 item: "flex items-center gap-3", // whole row
//                 label: "flex items-center gap-2", // label + checkbox
//                 checkbox: "mr-2 my-2 text-primary", // checkbox right side spacing
//                 count: "ml-3 text-sm bg-secondary text-white rounded-md px-1", // count spacing and style
//                 showMore: "text-blue-800",
//                 searchBox:
//                   "w-full max-w-md my-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
//               }}
//             />
//             <h4 className="font-bold mb-2 mt-4">Distance (km)</h4>

//             <input
//               type="range"
//               min={1}
//               max={10000}
//               value={radiusKm}
//               onChange={(e) => setRadiusKm(Number(e.target.value))}
//               className="w-full"
//             />

//             <div className="text-sm mt-1">{radiusKm} km</div>
//           </aside>

//           <main className="results flex-1">
//             <Hits hitComponent={Hit} />
//             <Pagination
//               classNames={{
//                 root: "flex justify-center mt-4",
//                 list: "flex items-center gap-2",
//                 item: "px-3 py-1 border rounded",
//                 link: "text-sm",
//                 selectedItem: "bg-primary text-white",
//               }}
//             />
//           </main>
//         </div>
//       </div>
//     </InstantSearch>
//   );
// }
