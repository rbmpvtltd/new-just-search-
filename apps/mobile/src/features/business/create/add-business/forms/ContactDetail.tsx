import { zodResolver } from "@hookform/resolvers/zod";
import { contactDetailSchema } from "@repo/db/dist/schema/business.schema";
import { useMutation } from "@tanstack/react-query";
import { isTRPCClientError } from "@trpc/client";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Alert, Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import type z from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/forms/formComponent";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { useAuthStore } from "@/features/auth/authStore";
import { useBusinessFormStore } from "@/features/business/shared/store/useCreateBusinessStore";
import { type OutputTrpcType, queryClient, trpc } from "@/lib/trpc";
import { setTokenRole } from "@/utils/secureStore";
export type AddBusinessPageType =
  | OutputTrpcType["businessrouter"]["add"]["getSalesman"]
  | null;

type ContactDetailSchema = z.infer<typeof contactDetailSchema>;
export default function ContactDetail({ data }: { data: AddBusinessPageType }) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const setToken = useAuthStore((s) => s.setToken);
  const clearPage = useBusinessFormStore((s) => s.clearPage);
  const formValue = useBusinessFormStore((s) => s.formValue);
  const prevPage = useBusinessFormStore((s) => s.prevPage);
  const setPage = useBusinessFormStore((s) => s.setPage);

  const { mutate, isError, error } = useMutation(
    trpc.businessrouter.create.mutationOptions(),
  );
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactDetailSchema>({
    resolver: zodResolver(contactDetailSchema),
    defaultValues: {
      contactPerson: "",
      phoneNumber: "",
      ownerNumber: "",
      whatsappNo: "",
      email: "",
      salesmanId: NaN,
    },
  });

  const onSubmit = (data: ContactDetailSchema) => {
    const finalData = {
      ...formValue,
      ...data,
    };
    useBusinessFormStore.setState((state) => ({
      formValue: { ...state.formValue, ...data },
    }));

    mutate(
      {
        ...finalData,
        pincode: formValue.pincode,
      },
      {
        onSuccess: async (data) => {
          if (data.success) {
            setPage(0);
            clearPage();
            setToken(token, "business");
            await setTokenRole(token ?? "", "business");
            Alert.alert(data.message);
            queryClient.invalidateQueries({
              queryKey: trpc.businessrouter.show.queryKey(),
            });
            router.replace("/(root)/profile");
          }
        },
        onError: (error) => {
          Alert.alert("On Error", error.message);

          if (isTRPCClientError(error)) {
            Alert.alert(error.message);
          }
          console.error("Error", error.message);
        },
      },
    );
  };

  const formFields: FormFieldProps<ContactDetailSchema>[] = [
    {
      control,
      name: "contactPerson",
      label: "Contact Name",
      placeholder: "Contact Person Name",
      component: "input",
      keyboardType: "default",
      className: "w-[90%] bg-base-200",
      error: errors.contactPerson?.message,
    },
    {
      control,
      name: "phoneNumber",
      label: "Contact Number",
      placeholder: "Contact Person Number",
      component: "input",
      keyboardType: "numeric",
      // editable: false,
      className: "w-[90%] bg-base-200",
      error: errors.phoneNumber?.message,
    },
    {
      control,
      name: "ownerNumber",
      label: "Owner Number",
      placeholder: "Business Owner Number",
      component: "input",
      keyboardType: "numeric",
      className: "w-[90%] bg-base-200",
      error: errors.ownerNumber?.message,
    },
    {
      control,
      name: "whatsappNo",
      label: "Whatsapp Number",
      placeholder: "Whatsapp Number",
      component: "input",
      keyboardType: "numeric",
      className: "w-[90%] bg-base-200",
      required: false,
      error: errors.whatsappNo?.message,
    },
    {
      control,
      name: "email",
      label: "Email",
      placeholder: "Enter your Email",
      component: "input",
      keyboardType: "email-address",
      className: "w-[90%] bg-base-200",
      required: false,
      error: errors.email?.message,
    },
    {
      control,
      name: "salesmanId",
      label: "Refer code",
      placeholder: "Select Refer code",
      component: "dropdown",
      data: data?.map((item) => ({
        label: item.referCode,
        value: item.id,
      })),
      dropdownPosition: "top",
      className: "w-[90%] bg-base-200",
      error: errors.salesmanId?.message,
    },
  ];
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={80}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 16 }}
      >
        <View className="mx-auto w-[90%]">
          {formFields.map((field) => (
            <FormField key={field.name} {...field} />
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
