"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactDetailSchema } from "@repo/db/dist/schema/business.schema";
import { useMutation } from "@tanstack/react-query";
import { isTRPCClientError } from "@trpc/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import type z from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useBusinessFormStore } from "@/features/business/shared/store/useCreateBusinessStore";
import { useTRPC } from "@/trpc/client";
import { getQueryClient } from "@/trpc/query-client";
import { setRole } from "@/utils/session";
import type { UserBusinessListingType } from "..";

type ContactDetailSchema = z.infer<typeof contactDetailSchema>;
export default function ContactDetail({
  businessListing,
}: {
  businessListing: UserBusinessListingType;
}) {
  const trpc = useTRPC();
  const router = useRouter();
  const { mutate } = useMutation(trpc.businessrouter.update.mutationOptions());
  const formValue = useBusinessFormStore((state) => state.formValue);
  const prevPage = useBusinessFormStore((state) => state.prevPage);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactDetailSchema>({
    resolver: zodResolver(contactDetailSchema),
    defaultValues: {
      contactPerson: businessListing?.business?.contactPerson ?? "",
      phoneNumber: businessListing?.business?.phoneNumber ?? "",
      ownerNumber: businessListing?.business?.ownerNumber ?? "",
      whatsappNo: businessListing?.business?.whatsappNo ?? "",
      email: businessListing?.business?.email ?? "",
    },
  });

  const formFields: FormFieldProps<ContactDetailSchema>[] = [
    {
      control,
      label: "Contact Person Name",
      name: "contactPerson",
      component: "input",
      placeholder: "Contact Person Name",
      error: errors.contactPerson?.message,
    },
    {
      control,
      label: "Contact Person Number",
      name: "phoneNumber",
      component: "input",
      placeholder: "Contact Person Number",
      disabled: true,
      error: errors.phoneNumber?.message,
    },
    {
      control,
      label: "Owner Number",
      name: "ownerNumber",
      placeholder: "Owner Number",
      component: "input",
      error: errors.ownerNumber?.message,
    },
    {
      control,
      label: "Whatsapp Number",
      name: "whatsappNo",
      component: "input",
      placeholder: "Whatsapp Number",
      required: false,
      error: errors.whatsappNo?.message,
    },
    {
      control,
      label: "Email Id",
      name: "email",
      component: "input",
      placeholder: "Email Id",
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
    //Store data in Zustand (merge with previous steps)
    useBusinessFormStore.setState((state) => ({
      formValue: { ...state.formValue, ...data },
    }));

    // Optional: verify merged data immediately
    // console.log(
    //   "Final merged Zustand data:",
    //   useBusinessFormStore.getState().formValue,
    // );

    mutate(
      { ...formValue, pincode: formValue.pincode },
      {
        onSuccess: async (data) => {
          if (data.success) {
            await Swal.fire({
              title: data.message,
              icon: "success",
              draggable: true,
            });
            const queryClient = getQueryClient();
            queryClient.invalidateQueries({
              queryKey: trpc.businessrouter.show.queryKey(),
            });
            // clearPage();
            router.push("/");
          }
          console.log("Success", data);
        },
        onError: (error) => {
          if (isTRPCClientError(error)) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
              // footer: '<a href="#">Why do I have this issue?</a>',
            });
            console.error("Error", error.message);
          }
        },
      },
    );
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
              {formFields.map((field, index) => (
                <FormField key={field.name} {...field} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end p-6 border-t border-gray-200 gap-4">
          <Button
            type="submit"
            onClick={prevPage}
            className="bg-orange-500 hover:bg-orange-700 font-bold cursor-pointer"
          >
            PREVIOUS
          </Button>
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-700 font-bold cursor-pointer"
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
