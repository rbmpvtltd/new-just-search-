"use client";
import React from "react";
import { useHireFormStore } from "../../shared/store/useCreateHireStore";
import DocumentsForm from "./forms/DocumentsForm";
import EducationForm from "./forms/EducationForm";
import PersonalDetailsForm from "./forms/PersonalDetailsForm";
import PreferredPositionForm from "./forms/PreferredPositionForm";

export default function AddHirePage() {
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
        return <PersonalDetailsForm />;
      case 1:
        return <EducationForm />;
      case 2:
        return <PreferredPositionForm />;
      case 3:
        return <DocumentsForm />;
      default:
        return <PersonalDetailsForm />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          {steps.map((label, index) => (
            <div
              key={index}
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

      <div className="border p-4 rounded-lg">{renderForm()}</div>
    </div>
  );
}
