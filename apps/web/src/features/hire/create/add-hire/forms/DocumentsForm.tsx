import { zodResolver } from "@hookform/resolvers/zod";
import { documentSchema } from "@repo/db/src/schema/hire.schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isTRPCClientError } from "@trpc/client";
import React from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { Button } from "@/components/ui/button";
import { useHireFormStore } from "@/features/hire/shared/store/useCreateHireStore";
import { useTRPC } from "@/trpc/client";

type DocumentSchema = z.infer<typeof documentSchema>;
export default function DocumentsForm() {
  const trpc = useTRPC();
  const { mutate } = useMutation(trpc.hirerouter.create.mutationOptions());
  const formValue = useHireFormStore((state) => state.formValue);
  const { page, prevPage, nextPage, setFormValue } = useHireFormStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DocumentSchema>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      idProof: formValue.idProof ?? "",
      idProofPhoto: formValue.idProofPhoto ?? "",
      coverLetter: formValue.coverLetter ?? "",
      resumePhoto: formValue.resumePhoto ?? "",
      aboutYourself: formValue.aboutYourself ?? "",
      // referCode: formValue.referCode ?? "RBMHORJ00000",
    },
  });

  console.log("form Values before submit", formValue);

  const onSubmit = (data: DocumentSchema) => {
    setFormValue("idProof", data.idProof ?? "");
    setFormValue("idProofPhoto", data.idProofPhoto ?? "");
    setFormValue("coverLetter", data.coverLetter ?? "");
    setFormValue("resumePhoto", data.resumePhoto ?? "");
    setFormValue("aboutYourself", data.aboutYourself ?? "");
    // setFormValue("referCode", data.referCode ?? "");

    console.log("form Values after submit", formValue);

    mutate(formValue, {
      onSuccess: (data) => {
        console.log("success", data);
      },
      onError: (error) => {
        if (isTRPCClientError(error)) {
          console.error("error,", error.message);
        }
      },
    });
  };

  const formFields: FormFieldProps<DocumentSchema>[] = [
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
      error: errors.idProof?.message,
    },
    {
      control,
      type: "",
      label: "",
      name: "idProofPhoto",
      placeholder: "Upload your photo",
      component: "input",
      error: errors.idProofPhoto?.message,
    },
    {
      control,
      label: "Cover Letter",
      name: "coverLetter",
      placeholder: "",
      component: "textarea",
      required: false,
      error: errors.coverLetter?.message,
    },
    {
      control,
      type: "",
      label: "Resume/CV",
      name: "resumePhoto",
      placeholder: "",
      component: "input",
      required: false,
      error: errors.resumePhoto?.message,
    },
    {
      control,
      label: "Describe About Yourself",
      name: "aboutYourself",
      placeholder: "",
      component: "textarea",
      required: false,
      error: errors.aboutYourself?.message,
    },
    // {
    //   control,
    //   label: "Refer Code",
    //   name: "referCode",
    //   placeholder: "Refer Code",
    //   component: "input",
    //   error: errors.referCode?.message,
    // },
  ];
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="shadow-xl mx-auto rounded-xl max-w-6xl bg-white"
      >
        <div className="p-8 space-y-8">
          <div className="p-6 shadow rounded-xl bg-white">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Documents
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
            onClick={prevPage}
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
