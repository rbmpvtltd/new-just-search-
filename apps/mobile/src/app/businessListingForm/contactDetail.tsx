import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { use } from "react";
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
import { Loading } from "@/components/ui/Loading";
import { SomethingWrong } from "@/components/ui/SomethingWrong";
import { PROFILE_URL } from "@/constants/apis";
import { addBusinessListing } from "@/query/addBusinessListing";
import { fetchVerifyAuth } from "@/query/auth";
import { useSuspenceData } from "@/query/getAllSuspense";
import {
  type BusinessContactData,
  businessContactSchema,
} from "@/schemas/businessContactSchema";
import { useAuthStore } from "@/store/authStore";
import useBusinessFormValidationStore from "@/store/businessFormStore";
import { objectToFormData } from "@/utils/objectToFormData";
import { setToken } from "@/utils/secureStore";

export default function Attachments({ activeTab }: { activeTab: string }) {
  const setFormValue = useBusinessFormValidationStore((s) => s.setFormValue);
  const getAuthStoreToken = useAuthStore((state) => state.token);
  const setAuthStoreToken = useAuthStore((state) => state.setToken);
  const router = useRouter();
  const { data } = useSuspenceData(PROFILE_URL.url, PROFILE_URL.key);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessContactData>({
    resolver: zodResolver(businessContactSchema),
    defaultValues: {
      contact_person: "",
      phone_number: data?.user?.phone,
      owner_no: "",
      whatsapp_no: "",
      email: "",
      refer_code: "RBMHORJ00000",
    },
  });

  const onSubmit = async (data: BusinessContactData) => {
    setFormValue("contact_person", data.contact_person ?? "");
    setFormValue("phone_number", data.phone_number ?? "");
    setFormValue("owner_no", data.owner_no ?? "");
    setFormValue("whatsapp_no", data.whatsapp_no ?? "");
    setFormValue("email", data.email ?? "");
    setFormValue("refer_code", data.refer_code);

    const finalData = useBusinessFormValidationStore.getState().formValue;
    const formData = objectToFormData(finalData);

    try {
      const response = await addBusinessListing(formData);

      if (response.success) {
        const verifyAuth = await fetchVerifyAuth(getAuthStoreToken);
        setAuthStoreToken(verifyAuth?.token, verifyAuth?.role);
        await setToken(verifyAuth?.token);
        router.replace("/user/bussinessList");
      } else {
        Alert.alert("something went wrong", response?.data?.message);
      }
    } catch (error) {
      console.log("Error updating business listing:", error);
    }
  };

  const formFields: FormFieldProps[] = [
    {
      control,
      name: "contact_person",
      label: "Contact Name",
      placeholder: "Contact Person Name",
      component: "input",
      keyboardType: "default",
      className: "w-[90%] bg-base-200",
      error: errors.contact_person?.message,
    },
    {
      control,
      name: "phone_number",
      label: "Contact Number",
      placeholder: "Contact Person Number",
      component: "input",
      keyboardType: "numeric",
      editable: false,
      className: "w-[90%] bg-base-200",
      error: errors.phone_number?.message,
    },
    {
      control,
      name: "owner_no",
      label: "Owner Number",
      placeholder: "Business Owner Number",
      component: "input",
      keyboardType: "numeric",
      className: "w-[90%] bg-base-200",
      error: errors.owner_no?.message,
    },
    {
      control,
      name: "whatsapp_no",
      label: "Whatsapp Number",
      placeholder: "Whatsapp Number",
      component: "input",
      keyboardType: "numeric",
      className: "w-[90%] bg-base-200",
      error: errors.whatsapp_no?.message,
    },
    {
      control,
      name: "email",
      label: "Email",
      placeholder: "Enter your Email",
      component: "input",
      keyboardType: "email-address",
      className: "w-[90%] bg-base-200",
      error: errors.email?.message,
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
            <FormField key={idx} {...field} />
          ))}
        </View>
        <View className="w-[37%] mx-auto m-4">
          <PrimaryButton
            isLoading={isSubmitting}
            title="Next"
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
