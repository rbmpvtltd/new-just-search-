"use client";
import type { OutputTrpcType } from "@/trpc/type";
import type { SetOpen } from "../../add.form";
import { useUserFormStore } from "../../shared/store/useCreateHireStore";
import DocumentsForm from "./forms/DocumentsForm";
import EducationForm from "./forms/EducationForm";
import PersonalDetailsForm from "./forms/PersonalDetailsForm";
import PreferredPositionForm from "./forms/PreferredPositionForm";

export type AddAdminUserType = OutputTrpcType["adminHireRouter"]["add"];
export function AddUserPage({
  data,
  setOpen,
}: {
  data: AddAdminUserType;
  setOpen: SetOpen;
}) {
  const page = useUserFormStore((state) => state.page);
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
        return <DocumentsForm setOpen={setOpen} />;
      default:
        return <PersonalDetailsForm data={data} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 relative">
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
