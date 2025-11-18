import { zodResolver } from "@hookform/resolvers/zod";
import { documentSchema } from "@repo/db/src/schema/hire.schema";
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
import { useTRPC } from "@/trpc/client";
import type { UserHireListingType } from "..";

type DocumentSchema = z.infer<typeof documentSchema>;
export default function DocumentsForm({
  hireListing,
}: {
  hireListing: UserHireListingType;
}) {
  const trpc = useTRPC();
  const router = useRouter();
  const { mutate } = useMutation(trpc.hirerouter.update.mutationOptions());
  const setFormValue = useHireFormStore((state) => state.setFormValue);
  const prevPage = useHireFormStore((state) => state.prevPage);
  const formValue = useHireFormStore((state) => state.formValue);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DocumentSchema>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      idProof: hireListing?.idProof ?? "",
      idProofPhoto: hireListing?.idProofPhoto ?? "",
      coverLetter: hireListing?.coverLetter ?? "",
      resumePhoto: hireListing?.resumePhoto ?? "",
      aboutYourself: hireListing?.aboutYourself ?? "",
    },
  });

  const onSubmit = async (data: DocumentSchema) => {
    // console.log("data", data);

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

    // console.log("formValue", formValue);

    mutate(formValue, {
      onSuccess: (data) => {
        console.log("success", data);
        Swal.fire({
          title: data.message,
          icon: "success",
          draggable: true,
        });
        router.push("/");
      },
      onError: (error) => {
        if (isTRPCClientError(error)) {
          Swal.fire({
            title: error.message,
            icon: "error",
            draggable: true,
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
