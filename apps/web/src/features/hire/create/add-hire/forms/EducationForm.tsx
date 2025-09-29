"use client";
import { type FieldValues, useForm } from "react-hook-form";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { Button } from "@/components/ui/button";

export default function EducationForm() {
  const { control } = useForm<FieldValues>();

  const formFields: FormFieldProps<FieldValues>[] = [
    {
      control,

      label: "Highest Qualification",
      name: "highestQualification",
      placeholder: "Highest Qualification",
      component: "select",
      options: [
        { label: "SSC", value: "SSC" },
        { label: "HSC", value: "HSC" },
        { label: "BSC", value: "BSC" },
        { label: "MSC", value: "MSC" },
        { label: "PHD", value: "PHD" },
      ],
      error: "",
    },
    {
      control,

      label: "Skill Set",
      name: "skillSet",
      placeholder: "Skill Set",
      component: "input",
      required: false,
      error: "",
    },
    {
      control,

      label: "Currently Employed",
      name: "currentlyEmployed",
      placeholder: "Currently Employed",
      component: "select",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
      error: "",
    },
    {
      control,

      label: "Work Experience (Years)",
      name: "workExperienceYears",
      placeholder: "Years",
      component: "select",
      options: [
        { label: "Fresher", value: "Fresher" },
        { label: "1 Year", value: "1 Year" },
        { label: "2 Years", value: "2 Years" },
        { label: "3 Years", value: "3 Years" },
        { label: "4 Years", value: "4 Years" },
        { label: "5 Years", value: "5 Years" },
      ],
      error: "",
    },
    {
      control,

      label: "Months",
      name: "workExperienceMonths",
      placeholder: "Months",
      component: "select",
      required: false,
      options: Array.from({ length: 11 }, (_, i) => ({
        label: `${i + 1} Month${i + 1 > 1 ? "s" : ""}`,
        value: `${i + 1} Month${i + 1 > 1 ? "s" : ""}`,
      })),
      error: "",
    },
    {
      control,

      label: "Job Role",
      name: "jobRole",
      placeholder: "Job Role",
      component: "input",
      error: "",
    },
    {
      control,

      label: "Previous Job Role",
      name: "previousJobRole",
      placeholder: "Previous Job Role",
      component: "input",
      required: false,
      error: "",
    },
    {
      control,
      type: "file",
      label: "Certificate",
      name: "certificate",
      placeholder: "Certificate",
      component: "checkbox",
      options: [
        { label: "Full Time", value: "Full Time" },
        { label: "Part Time", value: "Part Time" },
        { label: "Internship", value: "Internship" },
      ],
      required: false,
      error: "",
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <form className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl">
        <div className="p-8 space-y-8">
          <div className="p-6 bg-white rounded-xl shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Qualifications and Experience
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formFields.map((field) => {
                if (field.name === "workExperienceYears") {
                  const monthsField = formFields.find(
                    (f) => f.name === "workExperienceMonths",
                  );

                  return (
                    <div
                      key={field.name}
                      className="col-span-1 md:col-span-2 lg:col-span-2"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <FormField {...field} />
                        {monthsField && <FormField {...monthsField} />}
                      </div>
                    </div>
                  );
                }

                if (field.name === "workExperienceMonths") return null;

                return <FormField key={field.name} {...field} />;
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200 gap-4">
          <Button
            type="button"
            className="bg-orange-500 hover:bg-orange-700  font-bold"
          >
            PREVIOUS
          </Button>
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-700  font-bold "
          >
            CONTINUE
          </Button>
        </div>
      </form>
    </div>
  );
}
