import { zodResolver } from "@hookform/resolvers/zod";
import { businessDetailSchema } from "@repo/db/src/schema/business.schema";
import { useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import type z from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/forms/formComponent";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { useBusinessFormStore } from "@/features/business/shared/store/useCreateBusinessStore";
import { type OutputTrpcType, trpc } from "@/lib/trpc";

type BusinessDetailSchema = z.infer<typeof businessDetailSchema>;
type AddBusinessPAgeType = OutputTrpcType["businessrouter"]["add"] | null;
export default function BusinessDetail({
  data,
}: {
  data: AddBusinessPAgeType;
}) {
  const setFormValue = useBusinessFormStore((s) => s.setFormValue);
  const formValue = useBusinessFormStore((s) => s.formValue);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessDetailSchema>({
    resolver: zodResolver(businessDetailSchema),
    defaultValues: {
      name: formValue?.name ?? "",
      photo: formValue?.photo ?? "",
      categoryId: formValue?.categoryId ?? 0,
      subcategoryId: formValue?.subcategoryId ?? [],
      specialities: formValue?.specialities ?? "",
      homeDelivery: formValue?.homeDelivery ?? false,
      description: formValue?.description ?? "",
      // image2: "",
      // image3: "",
      // image4: "",
      // image5: "",
    },
  });

  const categories = data?.getBusinessCategories.map((item: any) => {
    return {
      label: item.title,
      value: item.id,
    };
  });

  const selectedCategoryId = useWatch({ control, name: "categoryId" });

  const { data: subCategories, isLoading } = useQuery(
    trpc.businessrouter.getSubCategories.queryOptions({
      categoryId: selectedCategoryId,
    }),
  );

  const onSubmit = (data: BusinessDetailSchema) => {
    setFormValue("name", data.name ?? "");
    setFormValue("photo", data.photo ?? "");
    setFormValue("categoryId", data.categoryId ?? "");
    setFormValue("subcategoryId", data.subcategoryId ?? "");
    setFormValue("specialities", data.specialities ?? "");
    setFormValue("homeDelivery", data.homeDelivery ?? "");
    setFormValue("description", data.description ?? "");
    // setFormValue("image1", data.image1 ?? "");
    // setFormValue("image2", data.image2 ?? "");
    // setFormValue("image3", data.image3 ?? "");
    // setFormValue("image4", data.image4 ?? "");
    // setFormValue("image5", data.image5 ?? "");
  };

  const formFields: FormFieldProps<BusinessDetailSchema>[] = [
    {
      control,
      name: "name",
      label: "Business Name",
      placeholder: "Enter your Business Name",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.name?.message,
    },
    {
      control,
      name: "photo",
      label: "Business Image",
      component: "image",
      className: "mx-auto w-[90%]",
      error: errors.photo?.message,
    },

    {
      control,
      name: "categoryId",
      label: "Category",
      placeholder: "Select Category",
      data: [
        ...(categories ?? []).map((item, index) => ({
          label: item.label,
          value: item.value,
        })),
      ],
      component: "dropdown",
      multiselect: 1,
      className: "w-[90%] bg-base-200",
      error: errors.categoryId?.message,
    },
    {
      control,
      name: "subcategoryId",
      label: "Sub Category",
      placeholder: "Select Sub Category",
      data: [
        ...(subCategories ?? []).map((item, index) => ({
          label: item.name,
          value: item.id,
        })),
      ],
      component: "multiselectdropdown",
      className: "w-[90%] bg-base-200",
      error: errors.subcategoryId?.message,
    },

    {
      control,
      name: "specialities",
      label: "Specialities",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.specialities?.message,
    },
    {
      control,
      name: "homeDelivery",
      label: "Home Delivery",
      component: "dropdown",
      data: [
        { label: "No", value: "no" },
        { label: "Yes", value: "yes" },
      ],
      dropdownPosition: "top",
      error: errors.homeDelivery?.message,
    },
    {
      control,
      name: "description",
      label: "About Your Business",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.description?.message,
    },
  ];

  // const formFields2: FormFieldProps[] = [
  //   {
  //     control,
  //     name: "image1",
  //     label: "",
  //     component: "image",
  //     error: errors.image1?.message?.toString(),
  //   },
  //   {
  //     control,
  //     name: "image2",
  //     label: "",
  //     component: "image",
  //     error: errors.image2?.message?.toString(),
  //   },
  //   {
  //     control,
  //     name: "image3",
  //     label: "",
  //     component: "image",
  //     error: errors.photo?.message?.toString(),
  //   },
  //   {
  //     control,
  //     name: "image4",
  //     label: "",
  //     component: "image",
  //     error: errors.image4?.message?.toString(),
  //   },
  //   {
  //     control,
  //     name: "image5",
  //     label: "",
  //     component: "image",
  //     error: errors.image3?.message?.toString(),
  //   },
  // ];

  return (
    // <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
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

        <View className="flex-row justify-between w-[90%] self-center mt-6 mb-60">
          <View className="w-[45%]">
            <PrimaryButton
              title="Next"
              isLoading={isSubmitting}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
    // </SafeAreaView>
  );
}
