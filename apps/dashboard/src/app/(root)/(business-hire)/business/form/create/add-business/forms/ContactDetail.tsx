"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactDetailSchema } from "@repo/db/dist/schema/business.schema";
import { useMutation } from "@tanstack/react-query";
import { isTRPCClientError } from "@trpc/client";
import { useForm } from "react-hook-form";
import type z from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";
import { getQueryClient } from "@/trpc/query-client";
import type { SetOpen } from "../../../add.form";
import { useBusinessFormStore } from "../../../shared/store/useCreateBusinessStore";

type ContactDetailSchema = z.infer<typeof contactDetailSchema>;
export default function ContactDetail({ setOpen }: { setOpen: SetOpen }) {
  const trpc = useTRPC();
  const { mutate } = useMutation(
    trpc.adminBusinessRouter.create.mutationOptions(),
  );
  const formValue = useBusinessFormStore((state) => state.formValue);
  const prevPage = useBusinessFormStore((state) => state.prevPage);
  const clearPage = useBusinessFormStore((state) => state.clearPage);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactDetailSchema>({
    resolver: zodResolver(contactDetailSchema),
    defaultValues: {
      contactPerson: formValue.contactPerson ?? "",
      phoneNumber: formValue.phoneNumber ?? "",
      ownerNumber: formValue.ownerNumber ?? "",
      whatsappNo: formValue.whatsappNo ?? "",
      email: formValue.email ?? "",
    },
  });

  const formFields: FormFieldProps<ContactDetailSchema>[] = [
    {
      control,
      label: "Contact Person Name",
      name: "contactPerson",
      component: "input",
      error: errors.contactPerson?.message,
    },
    {
      control,
      label: "Contact Person Number",
      name: "phoneNumber",
      component: "input",
      error: errors.phoneNumber?.message,
    },
    {
      control,
      label: "Owner Number",
      name: "ownerNumber",
      component: "input",
      error: errors.ownerNumber?.message,
    },
    {
      control,
      label: "Whatsapp Number",
      name: "whatsappNo",
      component: "input",
      required: false,
      error: errors.whatsappNo?.message,
    },
    {
      control,
      label: "Email Id",
      name: "email",
      component: "input",
      required: false,
      error: errors.email?.message,
    },
    // {
    //   control,
    //   label: "Refer Code",
    //   name: "referCode",
    //   component: "input",
    //   error: "",
    // },
  ];

  const onSubmit = (data: ContactDetailSchema) => {
    const finalData = { ...formValue, ...data };
    useBusinessFormStore.setState((state) => ({
      formValue: { ...state.formValue, ...data },
    }));

    mutate(finalData, {
      onSuccess: async (data) => {
        console.log("Success", data);
        if (data.success) {
          clearPage();
          const queryClient = getQueryClient();
          queryClient.invalidateQueries({
            queryKey: trpc.adminBusinessRouter.list.queryKey(),
          });
          setOpen(false);
        }
      },
      onError: (error) => {
        if (isTRPCClientError(error)) {
          console.error("Error", error.message);
        }
      },
    });
  };
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="shadow-xl mx-auto rounded-xl max-w-6xl bg-white"
      >
        <div className="p-8 space-y-8">
          <div className="p-6 shadow rounded-xl bg-white">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Business Contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {formFields.map((field) => (
                <FormField key={field.name} {...field} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end p-6 border-t border-gray-200 gap-4">
          <Button
            type="submit"
            onClick={prevPage}
            className="bg-orange-500 hover:bg-orange-700 font-bold"
          >
            PREVIOUS
          </Button>
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-700 font-bold"
          >
            {isSubmitting ? (
              <>
                <Spinner /> Loading...
              </>
            ) : (
              "SUBMIT"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
