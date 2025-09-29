import React from "react";
import { type FieldValues, useForm } from "react-hook-form";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { Button } from "@/components/ui/button";

export default function ContactDetail() {
  const { control } = useForm<FieldValues>();

  const formFields: FormFieldProps<FieldValues>[] = [
    {
      control,
      label: "Contact Person Name",
      name: "contactPersonName",
      component: "input",
      error: "",
    },
    {
      control,
      label: "Contact Person Number",
      name: "contactPersonNumber",
      component: "input",
      error: "",
    },
    {
      control,
      label: "Owner Number",
      name: "ownerNumber",
      component: "input",
      error: "",
    },
    {
      control,
      label: "Whatsapp Number",
      name: "whatsappNumber",
      component: "input",
      required: false,
      error: "",
    },
    {
      control,
      label: "Email Id",
      name: "emailId",
      component: "input",
      required: false,
      error: "",
    },
    {
      control,
      label: "Refer Code",
      name: "referCode",
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
              Business Contact
            </h2>
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
            SUBMIT
          </Button>
        </div>
      </form>
    </div>
  );
}
