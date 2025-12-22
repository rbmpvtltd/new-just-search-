import { zodResolver } from "@hookform/resolvers/zod";
import { documentSchema } from "@repo/db/dist/schema/hire.schema";
import { useMutation } from "@tanstack/react-query";
import { isTRPCClientError } from "@trpc/client";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Alert, Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import z from "zod";
import { uploadToCloudinary } from "@/components/cloudinary/cloudinary";
import {
  FormField,
  type FormFieldProps,
} from "@/components/forms/formComponent";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { useHireFormStore } from "@/features/hire/shared/store/useCreateHireStore";
import { trpc } from "@/lib/trpc";
import type { UserHireListingType } from "..";

export const documentInsertSchema = documentSchema
  .omit({
    salesmanId: true,
  })
  .extend({
    referCode: z.string().optional(),
  });
type DocumentSchema = z.infer<typeof documentInsertSchema>;

export default function DocumentsForm({ data }: { data: UserHireListingType }) {
  const setFormValue = useHireFormStore((s) => s.setFormValue);
  const prevPage = useHireFormStore((s) => s.prevPage);
  const formValue = useHireFormStore((s) => s.formValue);
  const clearPage = useHireFormStore((s) => s.clearPage);
  const setPage = useHireFormStore((s) => s.setPage);
  const { mutate } = useMutation(trpc.hirerouter.update.mutationOptions());
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DocumentSchema>({
    resolver: zodResolver(documentInsertSchema),
    defaultValues: {
      idProof: data?.hire?.idProof ?? NaN,
      idProofPhoto: data?.hire?.idProofPhoto ?? "",
      coverLetter: data?.hire?.coverLetter ?? "",
      resumePhoto: data?.hire?.resumePhoto ?? "",
      aboutYourself: data?.hire?.aboutYourself ?? "",
      referCode: data?.referCode?.referCode ?? "",
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
      onSuccess: async (data) => {
        if (data?.success) {
          setPage(0);
          clearPage();
          Alert.alert(data.message);
          router.replace("/(root)/(home)/home");
        }
      },
      onError: (error) => {
        if (isTRPCClientError(error)) {
          console.log("Error", error.message);
        }
      },
    });
  };

  const formFields: FormFieldProps<DocumentSchema>[] = [
    {
      control,
      name: "idProof",
      label: "ID Proof",
      component: "dropdown",
      data:
        data?.getDocuments?.map((doc) => ({
          label: doc.name,
          value: doc.id,
        })) ?? [],
      placeholder: "Select ID Proof",
      error: errors.idProof?.message,
    },
    {
      control,
      name: "idProofPhoto",
      label: "ID Proof Photo",
      component: "image",
      className: "w-[100%]",
      placeholder: "Select ID Proof Photo",
      error: errors.idProofPhoto?.message,
    },
    {
      control,
      name: "coverLetter",
      label: "Cover Letter",
      component: "textarea",
      className: " mx-auto w-[90%] bg-base-200",
      placeholder: "Write Cover Letter",
      error: errors.coverLetter?.message,
    },
    {
      control,
      name: "resumePhoto",
      label: "Resume Photo",
      component: "image",
      className: "w-[100%]",
      placeholder: "Select Resume Photo",
      error: errors.resumePhoto?.message?.toString(),
    },
    {
      control,
      name: "aboutYourself",
      label: "Describe About Yourself",
      component: "textarea",
      className: "mx-auto w-[90%] bg-base-200",
      placeholder: "Write About Yourself",
      error: errors.aboutYourself?.message,
    },
    {
      control,
      name: "referCode",
      label: "Refer Code",
      component: "input",
      disable: true,
      placeholder: "Select Salesman",
      error: errors.referCode?.message,
    },
  ];
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        className="w-[100%] h-full"
        extraScrollHeight={0}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mx-auto w-[90%]">
          {formFields.map((field, idx) => (
            <FormField key={idx.toString()} {...field} />
          ))}
        </View>
        <View className="flex-row justify-between w-[90%] self-center mt-6 mb-24">
          <View className="w-[45%]">
            <PrimaryButton title="Back" variant="outline" onPress={prevPage} />
          </View>
          <View className="w-[45%]">
            <PrimaryButton
              title="Submit"
              isLoading={isSubmitting}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}
