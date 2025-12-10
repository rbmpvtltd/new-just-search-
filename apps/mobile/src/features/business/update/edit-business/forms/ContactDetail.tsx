import { zodResolver } from "@hookform/resolvers/zod";
import { contactDetailSchema } from "@repo/db/dist/schema/business.schema";
import { useMutation } from "@tanstack/react-query";
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
import { useBusinessFormStore } from "@/features/business/shared/store/useCreateBusinessStore";
import { trpc } from "@/lib/trpc";
import type { UserBusinessListingType } from "..";

type ContactDetailSchema = z.infer<typeof contactDetailSchema>;
export default function ContactDetail({
  businessListing,
}: {
  businessListing: UserBusinessListingType;
}) {
  const router = useRouter();
  const formValue = useBusinessFormStore((s) => s.formValue);
  const prevPage = useBusinessFormStore((s) => s.prevPage);
  const setPage = useBusinessFormStore((s) => s.setPage);
  const clearPage = useBusinessFormStore((s) => s.clearPage);

  const { mutate } = useMutation(trpc.businessrouter.update.mutationOptions());
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactDetailSchema>({
    resolver: zodResolver(contactDetailSchema),
    defaultValues: {
      contactPerson: businessListing?.contactPerson ?? "",
      phoneNumber: businessListing?.phoneNumber ?? "",
      ownerNumber: businessListing?.ownerNumber ?? "",
      whatsappNo: businessListing?.whatsappNo ?? "",
      email: businessListing?.email ?? "",
    },
  });

  const onSubmit = async (data: ContactDetailSchema) => {
    const finalData = { ...formValue, ...data };
    useBusinessFormStore.setState((state) => ({
      formValue: { ...state.formValue, ...data },
    }));

    mutate(
      { ...finalData, pincode: formValue.pincode },
      {
        onSuccess: async (data) => {
          if (data.success) {
            setPage(0);
            clearPage();
            Alert.alert(data.message);
            router.replace("/(root)/profile");
          }
          console.log("Success", data);
        },
        onError: (error) => {
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
      editable: false,
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
  ];
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        // enableOnAndroid
        extraScrollHeight={80}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 6 }}
      >
        <View className="mx-auto w-[90%]">
          {formFields.map((field) => (
            <FormField key={field.name} {...field} />
          ))}
        </View>

        <View className="flex-row justify-between w-[90%] self-center mt-6">
          <View className="w-[45%]">
            <PrimaryButton
              title="Previous"
              variant="outline"
              onPress={prevPage}
            />
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
