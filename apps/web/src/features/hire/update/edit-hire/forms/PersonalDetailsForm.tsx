"use client";
import { type FieldValues, useForm } from "react-hook-form";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { Button } from "@/components/ui/button";

export default function PersonalDetailsForm() {
  const { control } = useForm<FieldValues>();

  const formFields: FormFieldProps<FieldValues>[] = [
    {
      control,
      type: "file",
      label: "Profile Image",
      name: "photo",
      placeholder: "Upload your photo",
      component: "input",
      section: "profile",
      error: "",
    },
    {
      control,
      type: "text",
      label: "Applied For",
      name: "appliedFor",
      placeholder: "Applied For",
      component: "select",
      section: "profile",
      options: [
        { value: "Job", label: "Job" },
        { value: "Internship", label: "Internship" },
        { value: "Other", label: "Other" },
      ],
      error: "",
    },
    {
      control,
      type: "text",
      label: "Sub Category",
      name: "subcategory",
      placeholder: "Select Sub Category",
      component: "multiselect",
      section: "profile",
      error: "",
    },
    {
      control,
      type: "text",
      label: "Full Name",
      name: "name",
      placeholder: "Full Name",
      component: "input",
      className: "",
      section: "profile",
      error: "",
    },
    {
      control,
      type: "text",
      label: "Gender",
      name: "gender",
      placeholder: "Select Gender",
      component: "select",
      section: "profile",
      error: "",
    },
    {
      control,
      type: "text",
      label: "Marital Status",
      name: "maritalStatus",
      placeholder: "Select Marital Status",
      component: "select",
      section: "profile",
      error: "",
    },
    {
      control,
      type: "text",
      label: "Father's Name",
      name: "fathersName",
      placeholder: "Father's Name",
      component: "input",
      section: "profile",
      error: "",
    },
    {
      control,
      type: "date",
      label: "Date of Birth",
      name: "dateOfBirth",
      placeholder: "Date of Birth",
      component: "input",
      section: "profile",
      error: "",
    },
    {
      control,
      type: "text",
      label: "Languages",
      name: "languages",
      placeholder: "Select Languages",
      component: "multiselect",
      section: "profile",
      options: [
        { value: "english", label: "English" },
        { value: "hindi", label: "Hindi" },
        { value: "telugu", label: "Telugu" },
        { value: "punjabi", label: "Punjabi" },
      ],
      error: "",
    },
    {
      control,
      type: "tel",
      label: "Mobile Number",
      name: "mobileNumber",
      placeholder: "Mobile Number",
      component: "input",
      section: "profile",
      error: "",
    },
    {
      control,
      type: "tel",
      label: "Alternate Mobile Number",
      name: "alternateMobileNumber",
      placeholder: "Alternate Mobile Number",
      component: "input",
      required: false,
      section: "profile",
      error: "",
    },
    {
      control,
      type: "email",
      label: "Email",
      name: "email",
      placeholder: "Email Address",
      component: "input",
      required: false,
      section: "profile",
      error: "",
    },
    {
      control,
      type: "text",
      label: "Latitude",
      name: "latitude",
      placeholder: "Latitude",
      section: "loction",
      component: "input",
      error: "",
    },
    {
      control,
      type: "text",
      label: "Longitude",
      name: "longitude",
      placeholder: "Longitude",
      component: "input",
      section: "loction",
      error: "",
    },
    {
      control,
      type: "text",
      label: "Address",
      name: "address",
      placeholder: "Address",
      component: "input",
      section: "loction",
      error: "",
    },
    {
      control,
      type: "text",
      label: "Pincode",
      name: "pincode",
      placeholder: "Pincode",
      component: "input",
      section: "loction",
      error: "",
    },
    {
      control,
      type: "text",
      label: "State",
      name: "state",
      placeholder: "Select State",
      component: "select",
      section: "loction",
      error: "",
    },
    {
      control,
      type: "text",
      label: "City",
      name: "city",
      placeholder: "Select City",
      component: "select",
      section: "loction",
      error: "",
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-8 ">
      <form className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl">
        <div className="p-8 space-y-8">
          <div className="p-6 bg-white rounded-xl shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Profile Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formFields
                .filter((fields) => fields.section === "profile")
                .map((field, index) => (
                  <FormField key={index} {...field} />
                ))}
            </div>

            <div className="md:col-span-2 lg:col-span-3 mt-10">
              <p className="mt-3 text-sm text-gray-500 italic mb-4">
                Your latitude and longitude will only be used to improve
                location-based services and will remain confidential. This
                information will not be shared publicly.
              </p>
              <div className="flex items-end justify-between mb-4">
                <h3 className="text-md font-medium text-gray-700">
                  Location Details
                </h3>

                <Button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow"
                >
                  Auto Detect Location
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formFields
                  .filter((fields) => fields.section === "loction")
                  .map((field, index) => (
                    <div
                      key={index}
                      className={
                        field.name === "address"
                          ? "md:col-span-2 lg:col-span-3"
                          : ""
                      }
                    >
                      <FormField {...field} />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-md"
          >
            CONTINUE
          </Button>
        </div>
      </form>
    </div>
  );
}
