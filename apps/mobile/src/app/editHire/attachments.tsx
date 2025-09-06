import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import React, { use, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  Keyboard,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  FormField,
  type FormFieldProps,
} from "@/components/forms/formComponent";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { MY_HIRE_URL } from "@/constants/apis";
import { apiUrl } from "@/constants/Variable";
import { idProof } from "@/data/dummy";
import { useSuspenceData } from "@/query/getAllSuspense";
import { updateHireListing } from "@/query/updateHireListing";
import {
  type AttachmentsFormSchemaType,
  attachmentsFormSchema,
} from "@/schemas/attachmentsFormSchema";
import { useAuthStore } from "@/store/authStore";
import useFormValidationStore from "@/store/formHireStore";
import { objectToFormData } from "@/utils/objectToFormData";

export default function Attachments({ activeTab }: { activeTab: string }) {
  const token = useAuthStore((state) => state.token);
  const setFormValue = useFormValidationStore((s) => s.setFormValue);
  const { data: myHire } = useSuspenceData(MY_HIRE_URL.url, MY_HIRE_URL.key);

  const { editHire } = useLocalSearchParams();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AttachmentsFormSchemaType>({
    resolver: zodResolver(attachmentsFormSchema),
    defaultValues: {
      id_proof: "",
      id_proof_photo: "",
      resume: "",
      resume_photo: "",
      about_yourself: "",
      refer_code: "",
    },
  });

  useEffect(() => {
    if (!myHire || !editHire) return;

    const myHireData = myHire?.data?.data?.find(
      (item: any) => item.id == editHire,
    );

    // id_proof
    const getIdProof = idProof.find(
      (item) => item.value == myHireData?.id_proof,
    );

    if (!myHireData) return;

    reset({
      id_proof: getIdProof?.value,
      id_proof_photo:
        myHireData.id_proof_photo &&
        `${apiUrl}/assets/images/${myHireData.id_proof_photo}`,
      resume: myHireData?.resume || "",
      resume_photo:
        myHireData.resume_photo &&
        `${apiUrl}/assets/images/${myHireData.resume_photo}`,
      about_yourself: myHireData?.about_yourself || "",
      refer_code: myHireData.refer_code,
    });
  }, [myHire, reset, editHire]);

  const onSubmit = async (data: AttachmentsFormSchemaType) => {
    setFormValue("id_proof", data.id_proof);
    setFormValue("id_proof_photo", data.id_proof_photo ?? "");
    setFormValue("resume", data.resume ?? "");
    setFormValue("resume_photo", data.resume_photo ?? "");
    setFormValue("about_yourself", data.about_yourself ?? "");
    setFormValue("refer_code", data.refer_code);

    const finalData = useFormValidationStore.getState().formValue;

    const formData = objectToFormData(finalData);

    try {
      const response = await updateHireListing(formData, token ?? "", editHire);

      if (response?.success) {
        console.log("Hire listing updated successfully");
        Alert.alert("Hire listing updated successfully");
        router.replace("/user/hirelisting");
      } else {
        Alert.alert(
          "something went wrong",
          response?.data?.errors
            ? response?.data?.errors?.[0]
            : " please try again later",
        );
      }
    } catch (error: unknown) {
      const e = error as { message?: string; error?: unknown };
      console.log(e.message || e.error || e);
    }
  };

  const formFields: FormFieldProps[] = [
    {
      control,
      name: "id_proof",
      label: "ID Proof",
      component: "dropdown",
      data: [...idProof],
      placeholder: "Select ID Proof",
      error: errors.id_proof?.message,
    },
    {
      control,
      name: "id_proof_photo",
      label: "ID Proof Photo",
      component: "image",
      className: "w-[100%]",
      error: errors.id_proof_photo?.message,
    },
    {
      control,
      name: "resume",
      label: "Cover Letter",
      component: "textarea",
      className: " mx-auto w-[90%] bg-base-200",
      error: errors.resume?.message,
    },
    {
      control,
      name: "resume_photo",
      label: "Resume Photo",
      component: "image",
      className: "w-[100%]",
    },
    {
      control,
      name: "about_yourself",
      label: "Describe About Yourself",
      component: "textarea",
      className: "mx-auto w-[90%] bg-base-200",
      error: errors.about_yourself?.message,
    },
    {
      control,
      name: "refer_code",
      label: "Refer Code",
      component: "input",
      className: "w-[90%] bg-base-200",
      editable: false,
      error: errors.refer_code?.message,
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
            <FormField key={idx} {...field} />
          ))}
        </View>
        <View className="w-[37%] mx-auto m-4">
          <PrimaryButton
            isLoading={isSubmitting}
            title="Submit"
            loadingText="Processing..."
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              marginLeft: "auto",
              marginRight: "auto",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
            textClassName="text-secondary text-lg font-semibold"
            disabled={isSubmitting}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}
