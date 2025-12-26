import { zodResolver } from "@hookform/resolvers/zod";
import { documentSchema } from "@repo/db/dist/schema/hire.schema";
import { useMutation } from "@tanstack/react-query";
import { isTRPCClientError } from "@trpc/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { uploadToCloudinary } from "@/components/image/cloudinary";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";
import { getQueryClient } from "@/trpc/query-client";
import type { SetOpen } from "../../../edit.form";
import { useHireFormStore } from "../../../shared/store/useCreateHireStore";
import type { EditAdminHireType } from "..";

export const adminDocumentInsertSchema = documentSchema
  .omit({
    salesmanId: true,
  })
  .extend({
    referCode: z.string().optional(),
  });
type DocumentSchema = z.infer<typeof adminDocumentInsertSchema>;
export default function DocumentsForm({
  data,
  setOpen,
}: {
  data: EditAdminHireType;
  setOpen: SetOpen;
}) {
  const trpc = useTRPC();
  const { mutate } = useMutation(trpc.adminHireRouter.update.mutationOptions());
  const setFormValue = useHireFormStore((state) => state.setFormValue);
  const prevPage = useHireFormStore((state) => state.prevPage);
  const formValue = useHireFormStore((state) => state.formValue);
  const clearPage = useHireFormStore((state) => state.clearPage);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DocumentSchema>({
    resolver: zodResolver(adminDocumentInsertSchema),
    defaultValues: {
      idProof: data?.hire?.idProof,
      idProofPhoto: data?.hire?.idProofPhoto ?? "",
      coverLetter: data?.hire?.coverLetter ?? "",
      resumePhoto: data?.hire?.resumePhoto ?? "",
      aboutYourself: data?.hire?.aboutYourself ?? "",
      referCode: data?.referCode?.referCode ?? "",
    },
  });

  
  const onSubmit = async (data: DocumentSchema) => {
    const files = await uploadToCloudinary(
      [data.idProofPhoto, data.resumePhoto],
      "hire",
    );

    setFormValue("idProof", data.idProof ?? "");
    setFormValue("idProofPhoto", files[0] ?? "");
    setFormValue("coverLetter", data.coverLetter ?? "");
    setFormValue("resumePhoto", files[1] ?? "");
    setFormValue("aboutYourself", data.aboutYourself ?? "");

    const newData = {
      ...data,
      idProofPhoto: files[0] ?? "",
      resumePhoto: files[1] ?? "",
    };
    const finalData = { ...formValue, ...newData };

    mutate(
      { ...finalData },
      {
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
      },
    );
  };
  const formFields: FormFieldProps<DocumentSchema>[] = [
    {
      control,
      label: "Id Proof",
      name: "idProof",
      placeholder: "Id Proof",
      component: "select",
      options: data.getDocuments.map((item) => ({
        label: item.name,
        value: item.id,
      })),
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
    {
      control,
      label: "Refer Code",
      name: "referCode",
      placeholder: "Refer Code",
      component: "input",
      disabled: true,
      error: errors.referCode?.message,
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formFields.map((field) => (
                <FormField key={field.name} {...field} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end p-6 border-t border-gray-200 gap-4">
          <Button
            onClick={prevPage}
            className="bg-orange-500 hover:bg-orange-700 font-bold"
          >
            PREVIOUS
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-md min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Spinner /> Submitting...
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
