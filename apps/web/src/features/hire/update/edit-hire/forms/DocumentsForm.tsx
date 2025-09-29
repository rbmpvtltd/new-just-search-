import React from "react";
import { type FieldValues, useForm } from "react-hook-form";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { Button } from "@/components/ui/button";

export default function DocumentsForm() {
  const { control } = useForm<FieldValues>();

  const formFields: FormFieldProps<FieldValues>[] = [
    {
      control,

      label: "Id Proof",
      name: "idProof",
      placeholder: "Id Proof",
      component: "select",
      options: [
        { label: "Aadhar Card", value: "Aadhar Card" },
        { label: "Pan Card", value: "Pan Card" },
        { label: "Voter Id Card", value: "Voter Id Card" },
        { label: "Driving License", value: "Driving License" },
        { label: "Others", value: "Others" },
      ],
    },
    {
      control,
      type: "file",
      label: "",
      name: "idProof",
      placeholder: "Upload your photo",
      component: "input",
      error: "",
    },
    {
      control,

      label: "Cover Letter",
      name: "coverLetter",
      placeholder: "",
      component: "textarea",
      required: false,
    },
    {
      control,
      type: "file",
      label: "Resume/CV",
      name: "resumePdf",
      placeholder: "",
      component: "input",
      required: false,
      error: "",
    },
    {
      control,

      label: "Describe About Yourself",
      name: "about",
      placeholder: "",
      component: "textarea",
      required: false,
    },
    {
      control,

      label: "Refer Code",
      name: "referCode",
      placeholder: "Refer Code",
      component: "input",
    },
  ];
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <form className="shadow-xl mx-auto rounded-xl max-w-6xl bg-white">
        <div className="p-8 space-y-8">
          <div className="p-6 shadow rounded-xl bg-white">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Documents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {formFields.map((field, index) => (
                <FormField key={index} {...field} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end p-6 border-t border-gray-200 gap-4">
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-700 font-bold"
          >
            PREVIOUS
          </Button>
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-700 font-bold"
          >
            SUBMIT
          </Button>
        </div>
      </form>
    </div>
  );
}
