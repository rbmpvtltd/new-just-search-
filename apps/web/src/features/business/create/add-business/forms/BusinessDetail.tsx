import React from "react";
import { type FieldValues, useForm } from "react-hook-form";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { Button } from "@/components/ui/button";

export default function BusinessDetail() {
  const { control, handleSubmit } = useForm<FieldValues>();

  

  const formFields: FormFieldProps<FieldValues>[] = [
    {
      control,
      label: "Business Name",
      name: "businessName",
      placeholder: "Business Name",
      component: "input",
      error: "",
    },
    {
      control,
      label: "Category",
      name: "category",
      placeholder: "Category",
      component: "select",
      options: [
        { label: "Category 1", value: "category1" },
        { label: "Category 2", value: "category2" },
      ],
      error: "",
    },
    {
      control,
      label: "Sub Category",
      name: "subCategory",
      placeholder: "Sub Category",
      component: "multiselect",
      options: [
        { label: "Sub Category 1", value: "subCategory1" },
        { label: "Sub Category 2", value: "subCategory2" },
      ],
      error: "",
    },
    {
      control,
      label: "Specialities",
      name: "specialities",
      placeholder: "Specialities",
      component: "input",
      required: false,
      error: "",
    },
    {
      control,
      label: "Home Delivery",
      name: "homeDelivery",
      placeholder: "Home Delivery",
      component: "select",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
      required: false,
      error: "",
    },
    {
      control,
      label: "About Business",
      name: "aboutBusiness",
      placeholder: "About Business",
      component: "textarea",
      required: false,
      error: "",
    },
    {
      control,
      type: "file",
      label: "Shop Images",
      name: "shopImage1",
      component: "input",
      required: false,
      error: "",
    },
    {
      control,
      type: "file",
      label: "",
      name: "shopImage2",
      component: "input",
      className: "mt-5",
      required: false,
      error: "",
    },
    {
      control,
      type: "file",
      label: "",
      name: "shopImage3",
      component: "input",
      required: false,
      error: "",
    },
    {
      control,
      type: "file",
      label: "",
      name: "shopImage4",
      component: "input",
      required: false,
      error: "",
    },
    {
      control,
      type: "file",
      label: "",
      name: "shopImage5",
      component: "input",
      required: false,
      error: "",
    },
  ];

  const onSubmit = (data: FieldValues) => {
    console.log(data);
  };
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="shadow-xl mx-auto rounded-xl max-w-4xl bg-white"
      >
        <div className="p-8 space-y-8">
          <div className="p-6 shadow rounded-xl bg-white">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Business Contact
            </h2>

            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={control}
                type="file"
                label="Business Logo"
                name="businessImage"
                placeholder=""
                component="input"
                error=""
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-3">
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
            SUBMIT
          </Button>
        </div>
      </form>
    </div>
  );
}
