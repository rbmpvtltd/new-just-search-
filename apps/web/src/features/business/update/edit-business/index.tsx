"use client";
import type { OutputTrpcType } from "@/trpc/type";
import { useBusinessFormStore } from "../../shared/store/useCreateBusinessStore";
import AddressDetail from "./forms/AddressDetail";
import BusinessDetail from "./forms/BusinessDetail";
import BusinessTiming from "./forms/BusinessTiming";
import ContactDetail from "./forms/ContactDetail";

export type UserBusinessListingType =
  | OutputTrpcType["businessrouter"]["edit"]
  | null;

export default function EditBusinessPage({
  businessListing,
}: {
  businessListing: UserBusinessListingType;
}) {
  const page = useBusinessFormStore((state) => state.page);
  const steps = [
    "Business Details",
    "Address Details",
    "Business Timing",
    "Contact Details",
  ];

  const renderForm = () => {
    switch (page) {
      case 0:
        return <BusinessDetail businessListing={businessListing} />;
      case 1:
        return <AddressDetail businessListing={businessListing} />;
      case 2:
        return <BusinessTiming businessListing={businessListing} />;
      case 3:
        return <ContactDetail businessListing={businessListing} />;
      default:
        return <BusinessDetail businessListing={businessListing} />;
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
