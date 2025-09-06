import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import {
  Alert,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  FormField,
  type FormFieldProps,
} from "@/components/forms/formComponent";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { idProof } from "@/data/dummy";
import { addHireListing } from "@/query/addHireListing";
import { fetchVerifyAuth } from "@/query/auth";
import {
  type AttachmentsFormSchemaType,
  attachmentsFormSchema,
} from "@/schemas/attachmentsFormSchema";
import { useAuthStore } from "@/store/authStore";
import useFormValidationStore from "@/store/formHireStore";
import { objectToFormData } from "@/utils/objectToFormData";
import { setToken } from "@/utils/secureStore";

export default function Attachments() {
  const setAuthStoreToken = useAuthStore((state) => state.setToken);
  const getAuthStoreToken = useAuthStore((state) => state.token);
  const setFormValue = useFormValidationStore((s) => s.setFormValue);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AttachmentsFormSchemaType>({
    resolver: zodResolver(attachmentsFormSchema),
    defaultValues: {
      id_proof: "",
      id_proof_photo: "",
      resume: "",
      resume_photo: "",
      about_yourself: "",
      refer_code: "RBMHORJ00000",
    },
  });
  const onSubmit = async (data: AttachmentsFormSchemaType) => {
    setFormValue("id_proof", data.id_proof);
    setFormValue("id_proof_photo", data.id_proof_photo);
    setFormValue("resume", data.resume ?? "");
    setFormValue("resume_photo", data.resume_photo ?? "");
    setFormValue("about_yourself", data.about_yourself ?? "");
    setFormValue("refer_code", data.refer_code ?? "");

    const finalData = useFormValidationStore.getState().formValue;
    const formData = objectToFormData(finalData);

    try {
      const response = await addHireListing(formData);
      console.log("response", response);

      if (response?.success) {
        const verifyAuth = await fetchVerifyAuth(getAuthStoreToken);

        setAuthStoreToken(verifyAuth?.token, verifyAuth?.role);
        // await deleteToken();
        await setToken(verifyAuth?.token);
        Alert.alert("listing added successfully");
        router.replace("/user/hirelisting");
      } else {
        console.log("something went wrong", response);

        Alert.alert("something went wrong", response?.data?.error);
      }
    } catch (error: unknown) {
      console.log("error", error);
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
      className: " mx-aw-[90%] bg-base-200",
      error: errors.resume?.message,
    },
    {
      control,
      name: "resume_photo",
      label: "Resume Photo",
      component: "image",
      className: "w-[100%]",
      error: errors.resume_photo?.message?.toString(),
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
            <FormField key={idx.toString()} {...field} />
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
