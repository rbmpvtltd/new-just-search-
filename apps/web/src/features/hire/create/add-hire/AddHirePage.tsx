import React from "react";
import DocumentsForm from "./forms/DocumentsForm";
import EducationForm from "./forms/EducationForm";
import PersonalDetailsForm from "./forms/PersonalDetailsForm";
import PreferredPositionForm from "./forms/PreferredPositionForm";

export default function AddHirePage() {
  return (
    <div>
      <PersonalDetailsForm />
      <EducationForm />
      <PreferredPositionForm />
      <DocumentsForm />
    </div>
  );
}
