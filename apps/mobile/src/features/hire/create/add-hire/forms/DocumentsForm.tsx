import { zodResolver } from "@hookform/resolvers/zod";
import { documentSchema } from "@repo/db/dist/schema/hire.schema";
import { useMutation } from "@tanstack/react-query";
import { isTRPCClientError } from "@trpc/client";
import { useForm } from "react-hook-form";
import { Alert, Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import type z from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/forms/formComponent";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { useHireFormStore } from "@/features/hire/shared/store/useCreateHireStore";
import { trpc } from "@/lib/trpc";
import { fetchVerifyAuth } from "@/query/auth";
import { useAuthStore } from "@/store/authStore";
import { setTokenRole } from "@/utils/secureStore";

type DocumentSchema = z.infer<typeof documentSchema>;

export default function DocumentsForm() {
  const setAuthStoreToken = useAuthStore((state) => state.setToken);
  const getAuthStoreToken = useAuthStore((state) => state.token);
  const setFormValue = useHireFormStore((s) => s.setFormValue);

  const prevPage = useHireFormStore((s) => s.prevPage);
  const formValue = useHireFormStore((s) => s.formValue);
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
    },
  });
  const onSubmit = async (data: DocumentSchema) => {
    setFormValue("idProof", data.idProof);
    setFormValue("idProofPhoto", data.idProofPhoto ?? "");
    setFormValue("coverLetter", data.coverLetter ?? "");
    setFormValue("resumePhoto", data.resumePhoto ?? "");
    setFormValue("aboutYourself", data.aboutYourself ?? "");
    console.log("Form Value", formValue);

    mutate(formValue, {
      onSuccess: async (data) => {
        if (data?.success) {
          // const verifyAuth = await fetchVerifyAuth(getAuthStoreToken);
          // setAuthStoreToken(verifyAuth?.token, verifyAuth?.role);
          // await setToken(verifyAuth?.token);
          Alert.alert("listing added successfully");
        }
      },
      // onError: (error) => {
      //   if (isTRPCClientError(error)) {
      //     console.log("Error", error);
      //   }
      // },
    });
  };

  const formFields: FormFieldProps<DocumentSchema>[] = [
    {
      control,
      name: "idProof",
      label: "ID Proof",
      component: "dropdown",
      data: [
        { label: "Aadhar Card", value: "Aadhar Card" },
        { label: "Pan Card", value: "Pan Card" },
        { label: "Voter Id Card", value: "Voter Id Card" },
        { label: "Driving License", value: "Driving License" },
        { label: "Others", value: "Others" },
      ],
      placeholder: "Select ID Proof",
      error: errors.idProof?.message,
    },
    {
      control,
      name: "idProofPhoto",
      label: "ID Proof Photo",
      component: "image",
      className: "w-[100%]",

      error: errors.idProofPhoto?.message,
    },
    {
      control,
      name: "coverLetter",
      label: "Cover Letter",
      component: "textarea",
      className: " mx-aw-[90%] bg-base-200",
      error: errors.coverLetter?.message,
    },
    {
      control,
      name: "resumePhoto",
      label: "Resume Photo",
      component: "image",
      className: "w-[100%]",
      error: errors.resumePhoto?.message?.toString(),
    },
    {
      control,
      name: "aboutYourself",
      label: "Describe About Yourself",
      component: "textarea",
      className: "mx-auto w-[90%] bg-base-200",
      error: errors.aboutYourself?.message,
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
        <View className="flex-row justify-between w-[90%] self-center mt-6 mb-60">
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
