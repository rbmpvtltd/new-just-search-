"use client";
import { algoliaClient } from "@repo/algolia";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef, useState } from "react";
import { InstantSearch, SearchBox, useInfiniteHits } from "react-instantsearch";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";

export default function UserDataComponent() {
  return <SearchComponent />;
  // return <CategoryComponent />;
}

const SearchComponent = () => {
  return (
    <div>
      <InstantSearch searchClient={algoliaClient} indexName="category">
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

          <main className="results  flex-1 w-[80%]">
            <InfiniteHits hitComponent={Hit} />

            <div className="text-center text-sm text-gray-500 mt-4">
              Scroll down to load more results!
            </div>
          </main>
          {/*   </div> */}
        </div>
      </InstantSearch>
    </div>
  );
};

const Hit = ({ hit }) => (
  <div className="hit-item p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
    <h3 className="text-lg font-semibold text-gray-900">
      {hit.title || "Untitled"}
    </h3>
  </div>
);

function InfiniteHits({ hitComponent: HitComponent, ...prop }) {
  const { items, isLastPage, showMore } = useInfiniteHits(prop);
  const scrollRef = useRef<HTMLUListElement>(null);

  const virtualizer = useVirtualizer({
    count: items?.length ?? 0,
    estimateSize: () => 60,
    getScrollElement: () => scrollRef.current,
  });

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (isLastPage || !lastItem || lastItem.index < items?.length - 1) {
      console.log("showMore", false);
      return;
    }
    console.log("showMore", true);
    showMore();
  }, [virtualItems, showMore, items, isLastPage]);

  console.log("isLastPage is", isLastPage);

  return (
    <div className="ais-InfiniteHits">
      <ul
        ref={scrollRef}
        className="ais-InfiniteHits-list h-96 overflow-y-scroll"
      >
        <div
          className="relative overflow-visible"
          style={{ height: `${virtualizer.getTotalSize()}px` }}
        >
          {virtualItems?.map((vItem) => {
            const item = items?.[vItem.index];
            if (!item) return null;
            return (
              <li
                key={item.objectID}
                className="absolute top-0 left-0 w-full text-center"
                style={{
                  transform: `translateY(${vItem.start}px)`,
                  height: `${vItem.size}px`,
                }}
                data-vindex={vItem.index}
                data-allindex={item.objectID}
              >
                <HitComponent hit={item} />
              </li>
            );
          })}
        </div>
      </ul>
    </div>
  );
}

const CategoryComponent = () => {
  const trpc = useTRPC();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [dbname, setDbName] = useState("");
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery(
    trpc.utilsRouter.categoryInfinate.infiniteQueryOptions(
      {
        name: dbname,
        cursor: 0,
        limit: 50,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ),
  );

  if (isLoading) <div>Loading...</div>;
  if (isError) <div> Error</div>;

  const alldata = (data?.pages.flatMap((page) => page.data) ?? []).filter(
    (item) => item.name.includes(name),
  );

  const virtualizer = useVirtualizer({
    count: alldata?.length ?? 0,
    estimateSize: () => 60,
    getScrollElement: () => scrollRef.current,
  });

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (
      !hasNextPage ||
      isFetchingNextPage ||
      !lastItem ||
      lastItem.index < alldata?.length - 1
    )
      return;
    fetchNextPage();
  }, [virtualItems, isFetchingNextPage, hasNextPage, fetchNextPage, alldata]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDbName(name);
    }, 500);

    return () => clearTimeout(timeout);
  }, [name]);

  return (
    <div>
      <Input value={name} onChange={(e) => setName(String(e.target.value))} />
      <div ref={scrollRef} className="h-96 overflow-y-scroll">
        <div
          className="relative overflow-visible"
          style={{ height: `${virtualizer.getTotalSize()}px` }}
        >
          {virtualItems?.map((vItem) => {
            const item = alldata?.[vItem.index];
            if (!item) return null;
            return (
              <div
                key={item.id}
                className="absolute top-0 left-0 w-full text-center"
                style={{
                  transform: `translateY(${vItem.start}px)`,
                  height: `${vItem.size}px`,
                }}
                data-vindex={vItem.index}
                data-allindex={item.id}
              >
                <div>{item.name}</div>
              </div>
            );
          })}
        </div>

        {isFetchingNextPage && <div>Loading More data ...</div>}
      </div>
    </div>
  );
};
