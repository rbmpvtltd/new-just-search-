"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";
import type { OutputTrpcType } from "@/trpc/type";
import { useBusinessFormStore } from "../../shared/store/useCreateBusinessStore";
import AddressDetail from "./forms/AddressDetail";
import BusinessDetail from "./forms/BusinessDetail";
import BusinessTiming from "./forms/BusinessTiming";
import ContactDetail from "./forms/ContactDetail";

export type AddBusinessPageType =
  | OutputTrpcType["businessrouter"]["add"]
  | null;

export default function CreateBusinessListing() {
  const [oprn, setOpen] = useState(true);
  return oprn ? (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
        <h2 className="mb-2 text-lg font-semibold">No Business Listings</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Create a business listing so people can find and contact your
          business.
        </p>

        <Button size="lg" className="px-8" onClick={() => setOpen(false)}>
          + Add Business
        </Button>
      </div>
    </div>
  ) : (
    <AddBusinessPage />
  );
}
function AddBusinessPage() {
  const trpc = useTRPC();
  const { data, error, isLoading, isError } = useQuery(
    trpc.businessrouter.add.queryOptions(),
  );
  const page = useBusinessFormStore((state) => state.page);
  if (isError) {
    console.log(error);
    return <div>Something went wrong</div>;
  }
  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (!data) return <div>Something went wrong</div>;
  const steps = [
    "Business Details",
    "Address Details",
    "Business Timing",
    "Contact Details",
  ];

  const renderForm = () => {
    switch (page) {
      case 0:
        return <BusinessDetail data={data} />;
      case 1:
        return <AddressDetail data={data} />;
      case 2:
        return <BusinessTiming />;
      case 3:
        return <ContactDetail data={data.getSalesman} />;
      default:
        return <BusinessDetail data={data} />;
    }
  };
  return (
    <div className="max-w-5xl mx-auto ">
      <div className="">
        <div className="flex justify-evenly mb-2 w-full">
          {steps.map((label, index) => (
            <div
              key={label}
              className={`text-sm font-medium ${index <= page ? "text-blue-600" : "text-gray-400"}`}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="w-[90%] mx-auto bg-gray-200 h-2 rounded-full">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((page + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
      <div className="rounded-lg">{renderForm()}</div>
    </div>
  );
}
