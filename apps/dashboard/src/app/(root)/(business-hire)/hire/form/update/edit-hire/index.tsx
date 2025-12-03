"use client";
import type { OutputTrpcType } from "@/trpc/type";
import { useHireFormStore } from "../../shared/store/useCreateHireStore";
import DocumentsForm from "./forms/DocumentsForm";
import EducationForm from "./forms/EducationForm";
import PersonalDetailsForm from "./forms/PersonalDetailsForm";
import PreferredPositionForm from "./forms/PreferredPositionForm";

export type UserHireListingType = OutputTrpcType["hirerouter"]["show"] | null;
export type FormReferenceDataType = OutputTrpcType["hirerouter"]["add"] | null;
export default function EditHirePage({
  hireListing,
  formReferenceData,
}: {
  hireListing: UserHireListingType;
  formReferenceData: FormReferenceDataType;
}) {
  const { page } = useHireFormStore();
  const steps = [
    "Personal Details",
    "Education",
    "Preferred Position",
    "Documents",
  ];

  const renderForm = () => {
    switch (page) {
      case 0:
        return (
          <PersonalDetailsForm
            hireListing={hireListing}
            formReferenceData={formReferenceData}
          />
        );
      case 1:
        return <EducationForm hireListing={hireListing} />;
      case 2:
        return <PreferredPositionForm hireListing={hireListing} />;
      case 3:
        return <DocumentsForm hireListing={hireListing} />;
      default:
        return (
          <PersonalDetailsForm
            hireListing={hireListing}
            formReferenceData={formReferenceData}
          />
        );
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
