import React from "react";
import { type FieldValues, useForm } from "react-hook-form";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { Button } from "@/components/ui/button";

export default function BusinessTiming() {
  const { control } = useForm<FieldValues>();

  const formFields: FormFieldProps<FieldValues>[] = [
    {
      control,
      label: "Opening Time",
      name: "openingTime",
      placeholder: "Opening Time",
      component: "select",
      required: false,
      error: "",
    },
    {
      control,

      label: "",
      name: "openingTimePeriod",
      placeholder: "",
      component: "select",
      required: false,
      error: "",
    },
    {
      control,

      label: "Closing Time",
      name: "closingTime",
      placeholder: "Closing Time",
      component: "select",
      required: false,
      error: "",
    },
    {
      control,

      label: "",
      name: "closingTimePeriod",
      placeholder: "",
      component: "select",
      required: false,
      error: "",
    },
  ];
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <form className="shadow-xl mx-auto rounded-xl max-w-6xl bg-white">
        <div className="p-8 space-y-8">
          <div className="p-6 shadow rounded-xl bg-white">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Business Timing
            </h2>
            <p className="mt-3 text-sm text-gray-500 italic mb-4">
              Let your customers know when you are available for them
            </p>
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={control}
                type=""
                label="Days"
                name="days"
                placeholder="Days"
                component="multiselect"
                options={[
                  { label: "Monday", value: "monday" },
                  { label: "Tuesday", value: "tuesday" },
                  { label: "Wednesday", value: "wednesday" },
                  { label: "Thursday", value: "thursday" },
                  { label: "Friday", value: "friday" },
                  { label: "Saturday", value: "saturday" },
                  { label: "Sunday", value: "sunday" },
                ]}
                required={false}
                error=""
              />
            </div>
            <div className="flex flex-col space-y-4 mt-4">
              <h3 className="text-base font-medium text-gray-700">
                Perffered Working Hours
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
                {formFields.map((field, index) => (
                  <FormField key={field.name} {...field} />
                ))}
              </div>
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
