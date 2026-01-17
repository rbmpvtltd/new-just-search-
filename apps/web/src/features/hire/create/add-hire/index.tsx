"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";
import type { OutputTrpcType } from "@/trpc/type";
import { useHireFormStore } from "../../shared/store/useCreateHireStore";
import DocumentsForm from "./forms/DocumentsForm";
import EducationForm from "./forms/EducationForm";
import PersonalDetailsForm from "./forms/PersonalDetailsForm";
import PreferredPositionForm from "./forms/PreferredPositionForm";

export type AddHirePageType = OutputTrpcType["hirerouter"]["add"];
export default function CreateHireListing() {
  const [open, setOpen] = useState(true);
  return open ? (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
        <h2 className="mb-2 text-lg font-semibold">No Hire Listings</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Create a hire listing so people can call or message you directly.
        </p>

        <Button size="lg" className="px-8" onClick={() => setOpen(false)}>
          + Add Hire
        </Button>
      </div>
    </div>
  ) : (
    <AddHirePage />
  );
}
function AddHirePage() {
  const trpc = useTRPC();
  const { data, error, isLoading, isError } = useQuery(
    trpc.hirerouter.add.queryOptions(),
  );
  const page = useHireFormStore((s) => s.page);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (isError) {
    console.log(error);
    return <div>Something went wrong</div>;
  }
  if (!data) return <div>Something went wrong</div>;
  const steps = [
    "Personal Details",
    "Education",
    "Preferred Position",
    "Documents",
  ];

  const renderForm = () => {
    switch (page) {
      case 0:
        return <PersonalDetailsForm data={data} />;
      case 1:
        return <EducationForm data={data} />;
      case 2:
        return <PreferredPositionForm />;
      case 3:
        return <DocumentsForm data={data} />;
      default:
        return <PersonalDetailsForm data={data} />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto ">
      <div className="">
        <div className="flex mx-auto justify-between mb-2 w-[90%]">
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
