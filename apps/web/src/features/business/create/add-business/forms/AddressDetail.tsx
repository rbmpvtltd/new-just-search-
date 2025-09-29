import React from "react";
import { type FieldValues, useForm } from "react-hook-form";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { Button } from "@/components/ui/button";

export default function AddressDetail() {
  const { control } = useForm<FieldValues>();

  const formFields: FormFieldProps<FieldValues>[] = [
    {
      control,

      label: "Block No/Building Name",
      name: "buildingName",
      placeholder: "Block No/Building Name",
      component: "input",
      error: "",
    },
    {
      control,

      label: "Street Name/Colony Name",
      name: "streetName",
      placeholder: "Street Name/Colony Name",
      component: "input",
      error: "",
    },
    {
      control,

      label: "Area",
      name: "area",
      placeholder: "Area",
      component: "input",
      error: "",
    },
    {
      control,

      label: "Landmark",
      name: "landmark",
      placeholder: "Landmark",
      component: "input",
      required: false,
      error: "",
    },
    {
      control,

      label: "Latitude",
      name: "latitude",
      placeholder: "Latitude",
      component: "input",
      error: "",
    },
    {
      control,

      label: "Longitude",
      name: "longitude",
      placeholder: "Longitude",
      component: "input",
      error: "",
    },
    {
      control,

      label: "Pincode",
      name: "pincode",
      placeholder: "Pincode",
      component: "input",
      error: "",
    },
    {
      control,

      label: "State",
      name: "state",
      placeholder: "State",
      component: "input",
      error: "",
    },
    {
      control,

      label: "City",
      name: "city",
      placeholder: "City",
      component: "input",
      error: "",
    },
  ];
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <form className="shadow-xl mx-auto rounded-xl max-w-6xl bg-white">
        <div className="p-8 space-y-8">
          <div className="p-6 shadow rounded-xl bg-white">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Business Address
            </h2>
            <p className="mt-3 text-sm text-gray-500 italic mb-4">
              Your latitude and longitude will only be used to improve
              location-based services and will remain confidential. This
              information will not be shared publicly.
            </p>
            <div className="flex items-end justify-between mb-4">
              <Button
                type="button"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow"
              >
                Auto Detect Location
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {formFields.map((field, index) => (
                <FormField key={field.name} {...field} />
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
            CONTINUE
          </Button>
        </div>
      </form>
    </div>
  );
}
