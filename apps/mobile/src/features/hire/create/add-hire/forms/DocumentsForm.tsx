import { zodResolver } from "@hookform/resolvers/zod";
import { documentSchema } from "@repo/db/dist/schema/hire.schema";
import { useMutation } from "@tanstack/react-query";
import { isTRPCClientError } from "@trpc/client";
import { router } from "expo-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Alert, Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import type z from "zod";
import { uploadToCloudinary } from "@/components/cloudinary/cloudinary";
import {
  FormField,
  type FormFieldProps,
} from "@/components/forms/formComponent";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { useAuthStore } from "@/features/auth/authStore";
import { useHireFormStore } from "@/features/hire/shared/store/useCreateHireStore";
import { queryClient, trpc } from "@/lib/trpc";
import { setTokenRole } from "@/utils/secureStore";
import type { AddHirePageType } from "..";

type DocumentSchema = z.infer<typeof documentSchema>;

export default function DocumentsForm({ data }: { data: AddHirePageType }) {
  const prevPage = useHireFormStore((s) => s.prevPage);
  const formValue = useHireFormStore((s) => s.formValue);
  const token = useAuthStore((s) => s.token);
  const setToken = useAuthStore((s) => s.setToken);
  const { mutate } = useMutation(trpc.hirerouter.create.mutationOptions());
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DocumentSchema>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      idProof: formValue?.idProof ?? "",
      idProofPhoto: formValue?.idProofPhoto ?? "",
      coverLetter: formValue?.coverLetter ?? "",
      resumePhoto: formValue?.resumePhoto ?? "",
      aboutYourself: formValue?.aboutYourself ?? "",
      salesmanId: formValue?.salesmanId ?? NaN,
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
          setToken(token, "business");
          await setTokenRole(token ?? "", "business");
          Alert.alert("listing added successfully");
          queryClient.invalidateQueries({
            queryKey: trpc.hirerouter.show.queryKey(),
          });
          router.push("/(root)/(home)/home");
        }
      },
      onError: (error) => {
        console.log("On Error", error.message);
        if (isTRPCClientError(error)) {
          Alert.alert("Something went wrong", "Some fields are missing");
          console.log("Error", error);
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
      data: data?.getDocuments.map((docs) => ({
        label: docs?.name,
        value: docs?.id,
      })),
      placeholder: "Select ID Proof",
      error: errors.idProof?.message,
    },
    {
      control,
      name: "idProofPhoto",
      label: "ID Proof Photo",
      component: "image",
      placeholder: "Select ID Proof Photo",
      className: "w-[100%]",
      required: false,
      error: errors.idProofPhoto?.message,
    },
    {
      control,
      name: "coverLetter",
      label: "Cover Letter",
      component: "textarea",
      className: " mx-auto w-[90%] bg-base-200",
      required: false,
      error: errors.coverLetter?.message,
    },
    {
      control,
      name: "resumePhoto",
      label: "Resume Photo",
      component: "image",
      placeholder: "Select Resume Photo",
      className: "w-[100%]",
      required: false,
      error: errors.resumePhoto?.message?.toString(),
    },
    {
      control,
      name: "aboutYourself",
      label: "Describe About Yourself",
      component: "textarea",
      className: "mx-auto w-[90%] bg-base-200",
      required: false,
      error: errors.aboutYourself?.message,
    },
    {
      control,
      name: "salesmanId",
      label: "Salesman",
      component: "dropdown",
      data: data?.getSalesman.map((salesman) => ({
        label: salesman?.referCode,
        value: salesman?.id,
      })),
      dropdownPosition: "top",
      placeholder: "Select Salesman",
      error: errors.salesmanId?.message,
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
