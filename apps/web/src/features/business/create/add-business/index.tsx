"use client";
import type { OutputTrpcType } from "@/trpc/type";
import { useBusinessFormStore } from "../../shared/store/useCreateBusinessStore";
import AddressDetail from "./forms/AddressDetail";
import BusinessDetail from "./forms/BusinessDetail";
import BusinessTiming from "./forms/BusinessTiming";
import ContactDetail from "./forms/ContactDetail";

export type AddBusinessPageType =
  | OutputTrpcType["businessrouter"]["add"]
  | null;

export default function AddBusinessPage({
  data,
}: {
  data: AddBusinessPageType;
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
        return <BusinessDetail data={data} />;
      case 1:
        return <AddressDetail data={data} />;
      case 2:
        return <BusinessTiming />;
      case 3:
        return <ContactDetail />;
      default:
        return <BusinessDetail data={data} />;
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          {steps.map((label, index) => (
            <div
              key={label}
              className={`text-sm font-medium ${index <= page ? "text-blue-600" : "text-gray-400"}`}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((page + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>
      <div className="border p-4 rounded-lg">{renderForm()}</div>
    </div>
  );
}
