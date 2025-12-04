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
            <div
              className="results-container max-h-96 overflow-y-auto border border-gray-200 rounded p-4 space-y-4"
              style={{ scrollBehavior: "smooth" }} // Optional: Smooth scrolling
            >
              <InfiniteHits hitComponent={Hit} />
            </div>

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

function InfiniteHits({ hitComponent: HitComponent }) {
  const { items, isLastPage, showMore } = useInfiniteHits();
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (sentinelRef.current !== null) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLastPage) {
            showMore();
          }
        });
      });

      observer.observe(sentinelRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [isLastPage, showMore]);
  console.log("isLastPage is ", isLastPage);

  return (
    <div className="ais-InfiniteHits">
      <ul className="ais-InfiniteHits-list">
        {items.map((hit) => (
          <li key={hit.objectID} className="ais-InfiniteHits-item">
            <HitComponent hit={hit} />
          </li>
        ))}
        <li
          className="ais-InfiniteHits-sentinel"
          ref={sentinelRef}
          aria-hidden="true"
        />
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
