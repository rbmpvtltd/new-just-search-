"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { documentSchema } from "@repo/db/dist/schema/hire.schema";
import { useMutation } from "@tanstack/react-query";
import { isTRPCClientError } from "@trpc/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Swal from "sweetalert2";
import type z from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { uploadToCloudinary } from "@/components/image/cloudinary";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";
import { getQueryClient } from "@/trpc/query-client";
import type { SetOpen } from "../../../add.form";
import { useUserFormStore } from "../../../shared/store/useCreateHireStore";

type DocumentSchema = z.infer<typeof documentSchema>;
export default function DocumentsForm({ setOpen }: { setOpen: SetOpen }) {
  const router = useRouter();
  const trpc = useTRPC();
  const { mutate } = useMutation(trpc.hirerouter.create.mutationOptions());
  const formValue = useUserFormStore((state) => state.formValue);
  const prevPage = useUserFormStore((state) => state.prevPage);
  const clearPage = useUserFormStore((state) => state.clearPage);
  const setFormValue = useUserFormStore((state) => state.setFormValue);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
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

  const onSubmit = async (data: DocumentSchema) => {
    const finalData = { ...formValue, ...data };
    const files = await uploadToCloudinary(
      [data.idProofPhoto, data.resumePhoto],
      "hire",
    );
    setFormValue("idProof", data.idProof ?? "");
    setFormValue("idProofPhoto", files[0] ?? "");
    setFormValue("coverLetter", data.coverLetter ?? "");
    setFormValue("resumePhoto", files[1] ?? "");
    setFormValue("aboutYourself", data.aboutYourself ?? "");
    // setFormValue("referCode", data.referCode ?? "");

    mutate(finalData, {
      onSuccess: async (data) => {
        if (data?.success) {
          clearPage();
          toast("success", {
            description: data.message,
          });
          const queryClient = getQueryClient();
          queryClient.invalidateQueries({
            queryKey: trpc.adminHireRouter.list.queryKey(),
          });
          setOpen(false);
        }
        console.log("success", data);
      },
      onError: async (error) => {
        if (isTRPCClientError(error)) {
          toast.error("Error", {
            description: error.message,
          });
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
      label: "Id Proof Photo",
      name: "idProofPhoto",
      placeholder: "Upload your photo",
      component: "image",
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
      component: "image",
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
  ];
  return (
    <div className="min-h-screen p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-6xl mx-auto bg-gray-100 rounded-lg shadow-xl"
      >
        <div className="p-8 space-y-8">
          <div className="p-6 shadow rounded-xl bg-white">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Documents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            {isSubmitting ? (
              <>
                {" "}
                <Spinner /> Submitting...{" "}
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
