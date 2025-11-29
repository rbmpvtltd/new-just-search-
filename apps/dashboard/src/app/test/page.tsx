"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { DebouncedInput } from "@/components/ui/input-debounced";
import { useTRPC } from "@/trpc/client";

export default function UserDataComponent() {
  return <CategoryComponent />;
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
