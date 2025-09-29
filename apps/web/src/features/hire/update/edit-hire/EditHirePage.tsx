import DocumentsForm from "./forms/DocumentsForm";
import EducationForm from "./forms/EducationForm";
import PersonalDetailsForm from "./forms/PersonalDetailsForm";
import PreferredPositionForm from "./forms/PreferredPositionForm";

export default function EditHirePage() {
  return (
    <div>
      <PersonalDetailsForm />
      <EducationForm />
      <PreferredPositionForm />
      <DocumentsForm />
    </div>
  );
}
