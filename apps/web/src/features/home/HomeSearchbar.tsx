"use client";
import { algoliaClient } from "@repo/algolia";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import {
  Configure,
  Hits,
  InstantSearch,
  useSearchBox,
} from "react-instantsearch";
import { SearchBoxComponent } from "./component/SearchBox";

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
            router.push(`/hiredetail/${hit.objectID}`);
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



function SearchPage() {
  return (
    <div className=" mx-auto sm:w-[90%] md:w-[50%]">
      <InstantSearch searchClient={algoliaClient} indexName="all_listing">
        <SearchBoxComponent />
        
        <SearchResults />
      </InstantSearch>
    </div>
  );
}

export default SearchPage;
