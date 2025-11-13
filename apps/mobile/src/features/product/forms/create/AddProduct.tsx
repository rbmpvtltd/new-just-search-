import { zodResolver } from "@hookform/resolvers/zod";
import { productInsertSchema } from "@repo/db/src/schema/product.schema";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
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

type AddProductSchema = z.infer<typeof productInsertSchema>;
export default function AddProduct() {
  const token = useAuthStore((state) => state.token);
  const { data } = useSuspenseQuery(trpc.productrouter.add.queryOptions());
  const { mutate } = useMutation(
    trpc.productrouter.addProduct.mutationOptions(),
  );
  const categories = data?.categoryRecord;
  const subCategories = data?.subcategoryRecord;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddProductSchema>({
    resolver: zodResolver(productInsertSchema),
    defaultValues: {
      productName: "",
      rate: 0,
      categoryId: categories?.id ?? 0,
      subcategoryId: [],
      productDescription: "",
      photo: "",
      image2: "",
      image3: "",
      image4: "",
      image5: "",
    },
  });

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center py-10">
        <Text className="text-gray-600">
          Unable to load the form. Try again later.
        </Text>
      </View>
    );
  }

  const onSubmit = async (data: AddProductSchema) => {
    const file = await uploadToCloudinary(
      [data.photo, data.image2, data.image3, data.image4, data.image5],
      "products",
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

  const formFields: FormFieldProps<AddProductSchema>[] = [
    {
      control,
      name: "productName",
      label: "Product Name",
      component: "input",
      keyboardType: "default",
      placeholder: "Product Name",
      className: "w-[90%] bg-base-200",
      error: errors.productName?.message,
    },
    {
      control,
      name: "rate",
      label: "Product Price",
      component: "input",
      keyboardType: "numeric",
      placeholder: "Product Price",
      className: "w-[90%] bg-base-200",
      error: errors.rate?.message,
    },
    {
      control,
      name: "categoryId",
      label: "Category",
      placeholder: "Select Category",
      data: categories
        ? [{ label: categories?.title, value: categories?.id }]
        : [],
      component: "dropdown",
      multiselect: 1,
      className: "w-[90%] bg-base-100",
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
      name: "productDescription",
      label: "Product Description",
      component: "editor",
      placeholder: "Offer Description",
      className: "w-[90%] bg-base-200",
      error: errors.productDescription?.message,
    },
  ];
  const formFields2: FormFieldProps<AddProductSchema>[] = [
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
      placeholder: "Select Image 2",
      component: "image",
      required: false,
      error: errors.image2?.message,
    },
    {
      control,
      name: "image3",
      placeholder: "Select Image 3",
      component: "image",
      required: false,
      error: errors.image3?.message,
    },
    {
      control,
      name: "image4",
      placeholder: "Select Image 4",
      component: "image",
      required: false,
      error: errors.image4?.message,
    },
    {
      control,
      name: "image5",
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
          <LableText title="Product images" className="ml-11" />
          <Text style={{ color: "red" }} className="ml-1 mt-2">
            *
          </Text>
        </View>
        <View className="mt-2 flex-1 flex-row flex-wrap items-center justify-center m-auto w-[80%] gap-4">
          {formFields2.map((field) => (
            <FormField labelHidden key={field.name} {...field} />
          ))}
        </View>
        <View className="flex-row justify-between w-[90%] self-center  mt-6 mb-10">
          <View className="w-[45%] mx-auto">
            <PrimaryButton
              title="Submit"
              isLoading={isSubmitting}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
