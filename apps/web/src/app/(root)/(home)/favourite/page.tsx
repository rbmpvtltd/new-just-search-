export const dynamic = "force-dynamic";

import { TRPCError } from "@trpc/server";
import { redirect } from "next/navigation";
import React from "react";
import { BussinessListingCard } from "@/features/business/show/component/BussinessListingCard";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";

async function page() {
  const { data, error } = await asyncHandler(
    trpcServer.businessrouter.favouritesShops.query(),
  );


  // if (error?.error?.shape?.data?.httpStatus === 401) {
  //   redirect("/login");
  // }
  if (error?.trpcError) {
    if (error.error.shape?.data.code === "UNAUTHORIZED") {
      redirect("/login");
      // console.log("---- I am here ------");
    }
  }
  if (data?.data?.length === 0) {
    return (
      <div className="mx-auto bg-primary-accent px-6 py-4 rounded-lg">
        <h1 className="text-secondary mx-auto">No Favourites Found</h1>
      </div>
    );
  }

  return (
    <div>
      {data?.data?.map((item, i) => {
        const shop = item.shop?.[0];
        if (!shop) return null;

        return (
          <div key={i.toString()}>
            <BussinessListingCard
              navigationId={item.shop[0]?.id}
              item={shop}
              rating={item.rating}
              category={item.category ?? ""}
              subcategory={item.subcategories}
            />
          </div>
        );
      })}
    </div>
  );
}

export default page;
