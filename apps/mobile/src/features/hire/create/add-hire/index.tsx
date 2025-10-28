import React from "react";
import PersonalDetailsForm from "./forms/PersonalDetailsForm";

export default function AddHire() {
  const data = [
    "Personal Details",
    "Education",
    "Preferred Position",
    "Documents",
  ];
  return <PersonalDetailsForm data={data} />;
}
