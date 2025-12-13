"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
    <Button onClick={() => setOpen(false)}>add hire</Button>
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
    return;
  }
  if (isError) {
    console.log(error);
    return;
  }
  if (!data) return null;
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
