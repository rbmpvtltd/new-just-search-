"use client";
import { algoliaClient } from "@repo/algolia";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { useState } from "react";
import {
  ClearRefinements,
  Configure,
  Hits,
  InstantSearch,
  Pagination,
  RangeInput,
  RefinementList,
  SearchBox,
} from "react-instantsearch";

function Hit({ hit }: { hit: any }) {
  return (
    <div className="group h-full rounded-xl border bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link
        href={{
          pathname: hit.discountPercent
            ? `/subcategory/aboutbusiness/offers/singleoffers/${hit.navigationId}`
            : `/subcategory/aboutbusiness/products/singleproduct/${hit.navigationId}`,
        }}
        className="block"
      >
        <div className="relative flex justify-center p-4">
          <div className="relative">
            {hit.photo ? (
              <CldImage
                width="200"
                height="260"
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                src={hit.photo}
                alt="Offer Image"
              />
            ) : (
              <div className="h-[260px] w-[200px] flex items-center justify-center text-sm text-muted-foreground">
                No Image
              </div>
            )}

            {hit.discountPercent > 0 && (
              <span className="absolute top-3 left-0 z-10 rounded-r-lg bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
                -{hit.discountPercent}%
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4 space-y-2">
        <h2 className="min-h-[3rem] text-center text-sm font-medium line-clamp-2 text-gray-900">
          {hit.name}
        </h2>

        <div className="flex flex-col items-center gap-1">
          {hit.discountPercent > 0 && (
            <p className="text-xs text-gray-400 line-through">₹ {hit.price}</p>
          )}

          <p className="text-lg font-bold text-primary">
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
              ? `(discountPercent >= ${discount} OR discountPercent = 0) AND (offerEndDate > ${Date.now()} OR offerEndDate = 0)`
              : `(offerEndDate > ${Date.now()} OR offerEndDate = 0)`
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
