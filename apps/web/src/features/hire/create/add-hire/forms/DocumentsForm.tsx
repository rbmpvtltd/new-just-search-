"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { documentSchema } from "@repo/db/dist/schema/hire.schema";
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
import { uploadToCloudinary } from "@/components/image/cloudinary";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useHireFormStore } from "@/features/hire/shared/store/useCreateHireStore";
import { sweetAlertError, sweetAlertSuccess } from "@/lib/sweetalert";
import { useTRPC } from "@/trpc/client";
import { getQueryClient } from "@/trpc/query-client";
import { setRole } from "@/utils/session";
import type { AddHirePageType } from "..";

type DocumentSchema = z.infer<typeof documentSchema>;
export default function DocumentsForm({ data }: { data: AddHirePageType }) {
  const router = useRouter();
  const trpc = useTRPC();
  const { mutate } = useMutation(trpc.hirerouter.create.mutationOptions());
  const formValue = useHireFormStore((state) => state.formValue);
  const setFormValue = useHireFormStore((state) => state.setFormValue);
  const prevPage = useHireFormStore((s) => s.prevPage);
  const clearPage = useHireFormStore((s) => s.clearPage);
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<DocumentSchema>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      idProof: formValue.idProof ?? "",
      idProofPhoto: formValue.idProofPhoto ?? "",
      coverLetter: formValue.coverLetter ?? "",
      resumePhoto: formValue.resumePhoto ?? "",
      aboutYourself: formValue.aboutYourself ?? "",
      salesmanId: formValue.salesmanId ?? NaN,
    },
  });
  const onSubmit = async (data: DocumentSchema) => {
    const mergedData = { ...formValue, ...data };
    const files = await uploadToCloudinary(
      [data.idProofPhoto, data.resumePhoto],
      "hire",
    );
    const finalData = {
      ...mergedData,
      idProofPhoto: files[0] ?? "",
      resumePhoto: files[1] ?? "",
    };
    useHireFormStore.setState((state) => ({
      formValue: finalData,
    }));
    mutate(finalData, {
      onSuccess: (data) => {
        if (data.success) {
          setRole("hire");
          sweetAlertSuccess(data.message);
          const queryClient = getQueryClient();
          queryClient.invalidateQueries({
            queryKey: trpc.hirerouter.show.queryKey(),
          });
          clearPage();
          router.push("/profile/hire");
        }
      },
      onError: (error) => {
        if (isTRPCClientError(error)) {
          sweetAlertError(error.message);
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
      component: "input",
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
      component: "textarea",
      required: false,
      error: errors.aboutYourself?.message,
    },
    {
      control,
      label: "Salesman Refer Code",
      name: "salesmanId",
      placeholder: "",
      component: "select",
      options: data.getSalesman.map((item) => ({
        label: item.referCode,
        value: item.id,
      })),
      error: errors.salesmanId?.message,
    },
  ];
  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl">
        <div className="p-8 space-y-8">
          <div className="p-6 bg-gray-50 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Documents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formFields.map((field) => (
                <FormField key={field.name} {...field} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end p-6 border-t border-gray-200 gap-4">
          <Button
            onClick={async () => {
              const currentData = getValues();
              const files = await uploadToCloudinary(
                [currentData?.idProofPhoto, currentData?.resumePhoto],
                "hire",
              );
              setFormValue("idProof", formValue.idProof ?? "");
              setFormValue("idProofPhoto", files[0] ?? "");
              setFormValue("coverLetter", formValue.coverLetter ?? "");
              setFormValue("resumePhoto", files[1] ?? "");
              setFormValue("aboutYourself", formValue.aboutYourself ?? "");
              prevPage();
            }}
            type="button"
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
