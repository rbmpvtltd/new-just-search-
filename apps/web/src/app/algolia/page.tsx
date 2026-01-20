"use client";

import { algoliaClient } from "@repo/algolia";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import {
  ClearRefinements,
  Configure,
  Hits,
  InstantSearch,
  RangeInput,
  RefinementList,
  SearchBox,
} from "react-instantsearch";
import { BussinessListingCard } from "@/features/business/show/component/BussinessListingCard";
import { HireListingCard } from "@/features/hire/show/component/HireListingCard";

function Hit({ hit }: { hit: any }) {
  console.log("hit is ", hit.categoryId);
  return (
    <div className="p-4 flex w-full flex-wrap justify-between gap-4">
      <div className="shadow-[0_4px_12px_rgba(0,0,0,0.650)] py-4 rounded-md hover:scale-101 transform transition-all duration-300 flex flex-col justify-between items-center lg:w-[30%] md:w-[45%] w-[95%]">
        <Link
          href={{
            pathname: hit.discountPercent
              ? `/business/singleoffer/${hit.navigationId}`
              : `/business/singleproduct/${hit.navigationId}`,
          }}
        >
          <div className="relative">
            <Image
              width={200}
              height={400}
              alt="offer image"
              src="https://www.justsearch.net.in/assets/images/6194461891759217396.png"
            />
            {hit.discountPercent && (
              <span className="absolute z-1 top-3 w-[70px] bg-error text-end px-4 text-white rounded-r-md">
                -{hit.discountPercent}%
              </span>
            )}
          </div>
        </Link>
        <h2 className="text-center font-medium line-clamp-2 px-4 w-full break-words">
          {hit.name}
        </h2>
        {hit.discountPercent && (
          <h2>
            ₹ <span className="line-through">{hit.price}</span>
          </h2>
        )}
        <h2 className="font-semibold text-primary">
          ₹ {hit.finalPrice ?? hit.price}
        </h2>
      </div>
    </div>
  );
}

export default function AlgoliaSearch() {
  // const lat = useRef<number | null>(null);
  // const lng = useRef<number | null>(null);
  const [discount, setDiscount] = useState(0);

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(
  //     (pos) => {
  //       lat.current = pos.coords.latitude
  //       lng.current = pos.coords.longitude
  //     },
  //     () => {
  //       console.log("Location permission denied");
  //     },
  //   );
  // }, []);
  return (
    <InstantSearch
      searchClient={algoliaClient}
      indexName="product_offer_listing"
    >
      <div className="search-container p-4">
        <SearchBox
          placeholder="Search Anything From Hires"
          classNames={{
            root: "w-full",
            form: "flex items-center justify-between border border-black px-2 rounded",
            input: "flex-1 outline-none py-2",
            submit: "ml-2", // search icon button
            reset: "ml-2", // clear icon button (optional)
          }}
        />

        <Configure
          analytics={false}
          hitsPerPage={20}
          filters={`discountPercent > ${discount}`}
          // {...(lat.current && lng.current
          //   ? {
          //       aroundLatLng: `${lat.current},${lng.current}`,
          //       aroundRadius: radiusKm * 1000,
          //     }
          //   : {})}
        />

        <div className="content flex gap-4 mt-6">
          {/* in sidebar ne apne according baad me manage karunga */}
          <aside className="filters w-64 shadow-2xl sticky">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-2xl">Filters</h3>

              <ClearRefinements
                classNames={{
                  button:
                    "text-sm px-2 py-1 border rounded bg-primary text-white",
                }}
              >
                Clear All Filters
              </ClearRefinements>
            </div>

            {/* <h4 className="font-bold mb-2 mt-4">Category</h4>
            <RefinementList
              attribute="category"
              limit={2}
              searchable={true}
              searchablePlaceholder="Search Category"
              showMore={true}
              classNames={{
                item: "flex items-center gap-3", // whole row
                label: "flex items-center gap-2", // label + checkbox
                checkbox: "mr-2 my-2 text-primary", // checkbox right side spacing
                count: "ml-3 text-sm bg-secondary text-white rounded-md px-1", // count spacing and style
                showMore: "text-blue-800",
                searchBox:
                  "w-full max-w-md my-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              }}
            /> */}
            {/* <h4 className="font-bold mb-2 mt-4">Subcategories</h4>
            <RefinementList
              attribute="subcategories"
              limit={2}
              searchable={true}
              searchablePlaceholder="Search Subcategories"
              showMore={true}
              classNames={{
                item: "flex items-center gap-3", // whole row
                label: "flex items-center gap-2", // label + checkbox
                checkbox: "mr-2 my-2 text-primary", // checkbox right side spacing
                count: "ml-3 text-sm bg-secondary text-white rounded-md px-1", // count spacing and style
                showMore: "text-blue-800",
                searchBox:
                  "w-full max-w-md my-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              }}
            />
            <h4 className="font-bold mb-2 mt-4">Distance (km)</h4>

            <input
              type="range"
              min={1}
              max={10000}
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full"
            />

            <div className="text-sm mt-1">{radiusKm} km</div> */}

            <div className="mb-6">
              <h4 className="font-bold mb-2 text-sm lg:text-base">Price</h4>
              <RangeInput
                attribute="price"
                classNames={{
                  root: "flex flex-col gap-2",
                  input:
                    "border border-gray-300 px-2 py-1.5 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                  submit:
                    "px-3 py-1 bg-primary text-white rounded text-sm mt-2",
                }}
              />
            </div>
            <div className="mb-6">
              <h4 className="font-bold mb-2 text-sm lg:text-base">
                Discount %
              </h4>

              <input
                type="range"
                min={1}
                max={100}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-full my-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="text-sm mt-1 text-gray-600">{discount}% </div>
            </div>
          </aside>

          {/* <main className="results  flex-1 w-[80%]"> */}
          {/*   <Hits hitComponent={Hit} /> */}
          {/* </main> */}
        </div>
      </div>
    </InstantSearch>
  );
}
