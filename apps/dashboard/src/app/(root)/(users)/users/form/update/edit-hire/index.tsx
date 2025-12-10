"use client";
import type { OutputTrpcType } from "@/trpc/type";
import type { SetOpen } from "../../edit.form";
import { useUserFormStore } from "../../shared/store/useCreateHireStore";
import DocumentsForm from "./forms/DocumentsForm";
import UserForm from "./forms/UserForm";

export type EditAdminHireType = OutputTrpcType["adminHireRouter"]["edit"];
export default function EditHirePage({
  data,
  setOpen,
}: {
  data: EditAdminHireType;
  setOpen: SetOpen;
}) {
  const { page } = useUserFormStore();
  const steps = [
    "Personal Details",
    "Education",
    "Preferred Position",
    "Documents",
  ];

  const renderForm = () => {
    switch (page) {
      case 0:
        return <UserForm data={data} />;
      case 1:
        return <DocumentsForm data={data} setOpen={setOpen} />;
      default:
        return <UserForm data={data} />;
    }
  };

  return (
    <div className="max-w-[90%] mx-auto p-2">
      <div className="mb-2">
        <div className="flex justify-between mb-2">
          {steps.map((label, index) => (
            <div
              key={label}
              className={`text-sm font-medium ${
                index <= page ? "text-blue-600" : "text-gray-400"
              }`}
            >
              {label}
            </div>
          ))}
        </div>

        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((page + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-lg">{renderForm()}</div>
    </div>
  );
}
