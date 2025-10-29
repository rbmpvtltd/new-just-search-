import { BussinessListingCard } from "@/features/business/show/component/BussinessListingCard";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";
import { redirect } from "next/navigation";
import React from "react";

async function page() {
  const { data, error } = await asyncHandler(
    trpcServer.businessrouter.favouritesShops.query(),
  );
  console.log(
    "data is =================================================================>",
    data,
  );

  if (error?.error?.shape?.data?.httpStatus === 401) {
    redirect("/login");
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
      {data?.data?.map((item, i) => (
        <div key={i.toString()}>
          <BussinessListingCard
            item={item.shop[0]}
            rating={item.rating}
            category={item.category ?? ""}
            subcategory={item.subcategories}
            initialFav={true}
          />
        </div>
      ))}
    </div>
  );
}

export default page;
