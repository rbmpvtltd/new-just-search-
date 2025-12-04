"use client";
import type { BaseHit, Hit } from "instantsearch.js";
import { Check } from "lucide-react";
import { AlgoliaInfinateList } from "@/components/ui/algolia-list";
import { cn } from "@/lib/utils";

export default function UserDataComponent() {
  return (
    <AlgoliaInfinateList
      className="w-56"
      searchPlaceHolder="search category"
      indexName="category"
      ListComponent={Hitted}
      estimateSize={20}
    />
  );
}

type HitType = Hit<BaseHit> & {
  title: string;
  id: string;
};

const Hitted = ({ hit }: { hit: HitType }) => {
  return (
    <div className="px-2">
      <button
        type="button"
        className={cn("hit-item w-full flex justify-between items-center")}
      >
        <div className="text-xs text-gray-900 text-start overflow-hidden text-ellipsis whitespace-nowrap hover:overflow-visible">
          {hit.title || "Untitled"}
        </div>
        <Check className="w-3 h-3 text-orange-600" />
      </button>
    </div>
  );
};
