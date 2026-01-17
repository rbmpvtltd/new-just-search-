"use client";
import { algoliaClient } from "@repo/algolia";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import {
  Configure,
  Hits,
  InstantSearch,
  SearchBox,
  useSearchBox,
} from "react-instantsearch";

function Hit({ hit }: { hit: any }) {
  const router = useRouter();

  return (
    <div className="px-4">
      <button
        type="button"
        onClick={() => {
          if (hit.listingType === "business") {
            router.push(`/subcategory/aboutBusiness/${hit.objectID}`);
          } else if (hit.listingType === "hire") {
            router.push(`/hireDetail/${hit.objectID}`);
          }
          console.log("clicked on", hit.objectID);
        }}
      >
        <p className="text-lg text-secondary-content">{hit.name}</p>
      </button>
    </div>
  );
}

function SearchResults() {
  const { query } = useSearchBox();
  const lat = useRef<number | null>(null);
  const lng = useRef<number | null>(null);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        lat.current = pos.coords.latitude;
        lng.current = pos.coords.longitude;
      },
      () => {
        console.log("Location permission denied");
      },
    );
  }, []);

  if (!query || query.trim().length === 0) {
    return null;
  }

  return (
    <>
      <Configure
        hitsPerPage={5}
        {...(lat.current && lng.current
          ? {
              aroundLatLng: `${lat.current},${lng.current}`,
              aroundRadius: 5000 * 1000,
            }
          : {})}
      />
      <Hits
        hitComponent={Hit}
        classNames={{
          list: "grid grid-cols-1 gap-4",
        }}
      />
    </>
  );
}

function SearchBoxCompo() {
  const { query } = useSearchBox();
  const router = useRouter();
  return (
    <SearchBox
      placeholder="Search Businesses"
      onSubmit={() => {
        console.log("query value is ===>", query);
        router.push(`/searchedListings?query=${query}`);
      }}
      classNames={{
        root: "w-full mb-4",
        form: "flex items-center justify-between border border-black px-2 rounded",
        input: "flex-1 outline-none py-2 ",
        submit: "ml-2",
        reset: "ml-2",
      }}
    />
  );
}

function HomeSearchBar() {
  return (
    <div className="m-8">
      <InstantSearch searchClient={algoliaClient} indexName="all_listing">
        <SearchBoxCompo />
        
        <SearchResults />
      </InstantSearch>
    </div>
  );
}

export default HomeSearchBar;
