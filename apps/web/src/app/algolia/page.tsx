"use client";

import {
  InstantSearch,
  SearchBox,
  Hits,
  RefinementList,
  Configure,
} from "react-instantsearch";
import { serverAlgolia } from "@repo/algolia";

function Hit({ hit }: { hit: any }) {
  console.log("hit is ", hit);
  return (
    <div className="hit border p-4 rounded mb-2">
      <h3 className="font-bold">{hit?.name}</h3>
      <p className="text-sm text-gray-600">{hit?.description}</p>
      <div className="mt-2">
        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
          {hit?.specialities}
        </span>
        {hit?.is_feature && (
          <span className="text-xs bg-blue-200 px-2 py-1 rounded ml-2">
            Featured
          </span>
        )}
      </div>
       <p className="text-xs text-red-500 mt-1">
        is_feature: {String(hit?.is_feature)} | 
        whatsapp_no: {hit?.whatsapp_no}
      </p>
      <p className="text-xs text-gray-500 mt-2">
        {hit?.area}, {hit?.city}
      </p>
    </div>
  );
}

export default function AlgoliaSearch() {
  return (
    <InstantSearch searchClient={serverAlgolia} indexName="justsearch_index">
      <div className="search-container p-4">
        <SearchBox placeholder="Search salons, services..." className="mb-4" />

        <Configure
           analytics={false}
          filters='id < 1000'
          hitsPerPage={5}
        />

        <div className="content flex gap-4">
          {/* in sidebar ne apne according baad me manage karunga */}
          <aside className="filters w-64">
            <h4 className="font-bold mb-2">Featured</h4>
            <RefinementList attribute="is_feature" />

            <h4 className="font-bold mb-2 mt-4">Specialities</h4>
            <RefinementList attribute="specialities" />

            <h4 className="font-bold mb-2 mt-4">Area</h4>
            <RefinementList attribute="area" />
          </aside>

          <main className="results flex-1">
            <Hits hitComponent={Hit} />
          </main>
        </div>
      </div>
    </InstantSearch>
  );
}
