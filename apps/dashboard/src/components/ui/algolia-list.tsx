import { algoliaClient } from "@repo/algolia";
import { useVirtualizer } from "@tanstack/react-virtual";

import type { BaseHit, Hit } from "instantsearch.js";

import { useEffect, useRef, useState } from "react";
import { InstantSearch, SearchBox, useInfiniteHits } from "react-instantsearch";

export const AlgoliaInfinateList = <T extends Hit<BaseHit>>({
  indexName,
  className = "",
  searchPlaceHolder = "Search Anything From Hires",
  estimateSize,
  ListComponent,
}: {
  indexName: string;
  className?: string;
  searchPlaceHolder?: string;
  estimateSize?: number;
  ListComponent: (props: { hit: T }) => JSX.Element;
}) => {
  const [show, setShow] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  // const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
  //   console.log("here");
  //   if (
  //     backdropRef.current &&
  //     backdropRef.current.contains(event.target as Node)
  //   ) {
  //     console.log("here 2");
  //     setShow(false);
  //   }
  // };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        backdropRef.current &&
        !backdropRef.current.contains(event.target as Node)
      ) {
        setShow(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <div className={className}>
      <InstantSearch searchClient={algoliaClient} indexName={indexName}>
        <div ref={backdropRef} className="search-container p-4">
          <SearchBox
            onFocus={() => setShow(true)}
            placeholder={searchPlaceHolder}
            classNames={{
              root: "w-full relative",
              form: "flex items-center justify-between border border-black px-2 rounded",
              input: "flex-1 outline-none py-2 p-4 ",
              submit:
                "absolute left-2 w-4 h-4 top-1/2 -translate-y-1/2 text-red-300 pointer-events-none ",
              reset: "absolute right-2 top-1/2 -translate-y-1/2",
              loadingIcon: "absolute right-2 top-1/2 -translate-y-1/2",
            }}
          />
          {show && (
            <main className="results flex-1">
              <InfiniteHits
                hitComponent={ListComponent}
                estimateSize={estimateSize}
              />
            </main>
          )}
        </div>
      </InstantSearch>
    </div>
  );
};

function InfiniteHits<T extends Hit<BaseHit>>({
  hitComponent: HitComponent,
  estimateSize = 20,
}: {
  hitComponent: (props: { hit: T }) => JSX.Element;
  estimateSize?: number;
}) {
  const { items, isLastPage, showMore } = useInfiniteHits<T>();
  const scrollRef = useRef<HTMLUListElement>(null);
  const showCount = useRef(0);
  const itemsLength = items.length;
  const lastFetchItem = useRef("");
  const virtualizer = useVirtualizer({
    count: itemsLength ?? 0,
    estimateSize: () => estimateSize,
    getScrollElement: () => scrollRef.current,
  });

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (
      isLastPage ||
      !lastItem ||
      lastItem.index < itemsLength - 1 ||
      lastFetchItem.current === items[itemsLength - 1]?.objectID
    ) {
      return;
    }
    lastFetchItem.current = items[itemsLength - 1]?.objectID ?? "";
    showMore();
    showCount.current++;
  }, [virtualItems, showMore, itemsLength, isLastPage, items]);

  return (
    <div className="ais-InfiniteHits">
      <ul
        ref={scrollRef}
        className="ais-InfiniteHits-list h-96 overflow-y-scroll overflow-x-visible"
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
