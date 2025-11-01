import { zodResolver } from "@hookform/resolvers/zod";
import { offersInsertSchema } from "@repo/db/src/schema/offer.schema";
import { useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import type z from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/forms/formComponent";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { trpc } from "@/lib/trpc";
import { useAuthStore } from "@/store/authStore";

type AddOfferSchema = z.infer<typeof offersInsertSchema>;
export default function AddOffer() {
  const token = useAuthStore((state) => state.token);
  const { data, error, isLoading, isError } = useQuery(
    trpc.businessrouter.add.queryOptions(),
  );

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<AddOfferSchema>({
    resolver: zodResolver(offersInsertSchema),
    defaultValues: {
      offerName: "",
      rate: 0,
      discountPercent: 0,
      finalPrice: 0,
      categoryId: 0,
      subcategoryId: [],
      offerDescription: "",
      photo: "",
      image2: "",
      image3: "",
      image4: "",
      image5: "",
    },
  });

  const categories = data?.getBusinessCategories.map((item: any) => {
    return {
      label: item.title,
      value: item.id,
    };
  });
  const selectedCategoryId = useWatch({ control, name: "categoryId" });
  const { data: subCategories } = useQuery(
    trpc.businessrouter.getSubCategories.queryOptions({
      categoryId: selectedCategoryId,
    }),
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-10">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-gray-600 mt-3">Preparing form...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center py-10 px-6">
        <Text className="text-red-600 text-center font-semibold mb-2">
          Something went wrong
        </Text>
        <Text className="text-gray-500 text-sm text-center">
          {error.message ||
            "Unable to load offer form. Please try again later."}
        </Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center py-10">
        <Text className="text-gray-600">
          Unable to load the form. Try again later.
        </Text>
      </View>
    );
  }

  const onSubmit = async (data: AddOfferSchema) => {};

  const formFields: FormFieldProps<AddOfferSchema>[] = [
    {
      control,
      name: "offerName",
      label: "Product Name",
      component: "input",
      keyboardType: "default",
      placeholder: "Offer Name",
      className: "w-[90%] bg-base-200",
      error: errors.offerName?.message,
    },
    {
      control,
      name: "rate",
      label: "Offer Price",
      component: "input",
      keyboardType: "numeric",
      placeholder: "Offer Price",
      className: "w-[90%] bg-base-200",
      error: errors.rate?.message,
      onValueChange: (value) => {
        if (!value) return;
        setValue("finalPrice", Number(value));
      },
    },
    {
      control,
      name: "discountPercent",
      label: " Discount",
      component: "input",
      keyboardType: "numeric",
      placeholder: "e.g 10",
      className: "w-[90%] bg-base-200",
      error: errors.discountPercent?.message,
      onValueChange: (value) => {
        if (!value) return;
        const discount = parseFloat(String(value));
        const price = parseFloat((getValues("rate") || 0).toString());
        const final = (price * (100 - discount)) / 100;
        setValue("discountPercent", Number(value));
        setValue("finalPrice", parseFloat(final.toFixed(2)));
      },
    },
    {
      control,
      name: "finalPrice",
      label: " Final Price",
      component: "input",
      keyboardType: "numeric",
      placeholder: "Final Price",
      className: "w-[90%] bg-base-200",
      error: errors.finalPrice?.message,
    },
    {
      control,
      name: "categoryId",
      label: "Category",
      placeholder: "Select Category",
      data:
        categories?.map((item) => ({ label: item.label, value: item.value })) ??
        [],
      component: "dropdown",
      multiselect: 1,
      className: "w-[90%] bg-base-200",
      disable: true,
      error: errors.categoryId?.message,
    },
    {
      control,
      name: "subcategoryId",
      label: "Sub Category",
      placeholder: "Select Sub Category",
      data:
        subCategories?.map((item) => ({
          label: item.name,
          value: item.id,
        })) ?? [],
      component: "multiselectdropdown",
      multiselect: Infinity,
      className: "w-[90%] bg-base-200",
      error: errors?.subcategoryId?.message,
    },
    {
      control,
      name: "offerDescription",
      label: "Offer Description",
      component: "editor",
      keyboardType: "default",
      placeholder: "Offer Description",
      className: "w-[90%] bg-base-200",
      error: errors.offerDescription?.message,
    },
  ];
  //   const formFields2: FormFieldProps<AddOfferSchema>[] = [
  //     {
  //       control,
  //       name: "image1",
  //       label: "",
  //       // placeholder: 'Enter Image 2',
  //       component: "image",
  //       className: "",
  //       error: errors.image1?.message?.toString(),
  //     },
  //     {
  //       control,
  //       name: "image2",
  //       label: "",
  //       // placeholder: 'Enter Image 3',
  //       component: "image",
  //       className: "",
  //       error: errors.image2?.message?.toString(),
  //     },
  //     {
  //       control,
  //       name: "image3",
  //       label: "",
  //       // placeholder: 'Enter Image 2',
  //       component: "image",
  //       error: errors.image3?.message?.toString(),
  //     },
  //     {
  //       control,
  //       name: "image4",
  //       label: "",
  //       // placeholder: 'Enter Image 3',
  //       component: "image",
  //       error: errors.image4?.message?.toString(),
  //     },
  //     {
  //       control,
  //       name: "image5",
  //       label: "",
  //       // placeholder: 'Enter Image 4',
  //       component: "image",
  //       error: errors.image5?.message?.toString(),
  //     },
  //   ];
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView className="w-[100%] h-full">
        <View className=" mx-auto w-[90%]">
          {formFields.map((field) => (
            <FormField key={field.name} {...field} />
          ))}
        </View>
        {/* <View className="mt-8 flex-1 flex-row flex-wrap items-center justify-center m-auto w-[80%] gap-4">
          {formFields2.map((field, idx) => (
            <FormField labelHidden key={idx} {...field} />
          ))}
        </View> */}
        <View className="flex-row justify-between w-[90%] self-center mt-6 mb-60">
          <View className="w-[45%]">
            <PrimaryButton
              title="Next"
              isLoading={isSubmitting}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
