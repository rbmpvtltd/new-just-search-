import { zodResolver } from "@hookform/resolvers/zod";
import { offersInsertSchema } from "@repo/db/src/schema/offer.schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import type z from "zod";
import { uploadToCloudinary } from "@/components/cloudinary/cloudinary";
import {
  FormField,
  type FormFieldProps,
} from "@/components/forms/formComponent";
import LableText from "@/components/inputs/LableText";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { trpc } from "@/lib/trpc";
import { useAuthStore } from "@/store/authStore";

type AddOfferSchema = z.infer<typeof offersInsertSchema>;
export default function AddOffer() {
  const token = useAuthStore((state) => state.token);
  const { data, error, isLoading, isError } = useQuery(
    trpc.businessrouter.add.queryOptions(),
  );
  const { mutate } = useMutation(trpc.offerrouter.addOffer.mutationOptions());
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

  const onSubmit = async (data: AddOfferSchema) => {
    const file = await uploadToCloudinary(
      [data.photo, data.image2, data.image3, data.image4, data.image5],
      "offers",
    );
    mutate(
      {
        ...data,
        photo: file[0] ?? "",
        image2: file[1] ?? "",
        image3: file[2] ?? "",
        image4: file[3] ?? "",
        image5: file[4] ?? "",
      },
      {
        onSuccess: (data) => {
          if (data.success) {
            Alert.alert(data.message);
          }
          // router.push("/");
        },
      },
    );
  };

  const formFields: FormFieldProps<AddOfferSchema>[] = [
    {
      control,
      name: "offerName",
      label: "Offer Name",
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
        console.log("Rate Value", value);
        if (!value) return;
        setValue("finalPrice", Number(value));
      },
    },
    {
      control,
      name: "discountPercent",
      label: " Discount Percent %",
      component: "input",
      keyboardType: "numeric",
      placeholder: "e.g 10",
      className: "w-[90%] bg-base-200",
      error: errors.discountPercent?.message,
      required: false,
      onValueChange: (value) => {
        console.log("Value", value);

        if (!value) return;
        const discount = parseFloat(String(value));
        const price = parseFloat((getValues("rate") || 0).toString());
        const final = (price * (100 - discount)) / 100;
        console.log("Final value", final);

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
      className: "w-[90%] bg-base-200 ",
      error: errors.offerDescription?.message,
    },
  ];
  const formFields2: FormFieldProps<AddOfferSchema>[] = [
    {
      control,
      name: "photo",
      placeholder: "Select Image 1",
      component: "image",
      required: false,
      error: errors.photo?.message,
    },
    {
      control,
      name: "image2",
      label: "",
      placeholder: "Select Image 2",
      component: "image",
      required: false,
      className: "",
      error: errors.image2?.message,
    },
    {
      control,
      name: "image3",
      label: "",
      placeholder: "Select Image 3",
      component: "image",
      required: false,
      error: errors.image3?.message,
    },
    {
      control,
      name: "image4",
      label: "",
      placeholder: "Select Image 4",
      component: "image",
      required: false,
      error: errors.image4?.message,
    },
    {
      control,
      name: "image5",
      label: "",
      placeholder: "Select Image 5",
      component: "image",
      required: false,
      error: errors.image5?.message,
    },
  ];
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView className="w-[100%] h-full">
        <View className=" mx-auto w-[90%]">
          {formFields.map((field) => (
            <FormField key={field.name} {...field} />
          ))}
        </View>
        <View className="flex-row items-center">
          <LableText title="Offer images" className="ml-8" />
          <Text style={{ color: "red" }} className="ml-1 mt-2">
            *
          </Text>
        </View>
        <View className="mt-2 flex-1 flex-row flex-wrap items-center justify-center m-auto w-[80%] gap-4">
          {formFields2.map((field, idx) => (
            <FormField labelHidden key={field.name} {...field} />
          ))}
        </View>
        <View className="flex-row justify-between w-[90%] self-center mt-6 mb-12">
          <View className="w-[45%] mx-auto">
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
