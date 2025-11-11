"use client";

import { InstantSearch, SearchBox, Hits, Highlight, Configure } from "react-instantsearch";
import { serverAlgolia } from "@repo/algolia";
import { useState } from "react";

function Hit({ hit }: { hit: any }) {
  console.log(hit);
  return (
    <div className="p-2 border-b">
      <h1>
        <Highlight attribute="name" hit={hit} />
      </h1>
    </div>
  );
}

export default function Page() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  return (
    <InstantSearch searchClient={serverAlgolia} indexName="justsearch_index">
         <Configure hitsPerPage={5} /> 
      <div className="p-4 max-w-lg mx-auto">
        <SearchBox
          onFocus={() => setIsVisible(true)}
        />
        <div className={isVisible ? "block" : "hidden"}>
          <Hits hitComponent={Hit} />
        </div>
      </div>
    </InstantSearch>
  );
}
