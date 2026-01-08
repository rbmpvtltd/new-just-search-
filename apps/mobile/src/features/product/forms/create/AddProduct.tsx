import { zodResolver } from "@hookform/resolvers/zod";
import { productInsertSchema } from "@repo/db/dist/schema/product.schema";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { isTRPCClientError } from "@trpc/client";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import type z from "zod";
import { uploadToCloudinary } from "@/components/cloudinary/cloudinary";
import {
  FormField,
  type FormFieldProps,
} from "@/components/forms/formComponent";
import LableText from "@/components/inputs/LableText";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { queryClient, trpc } from "@/lib/trpc";

type AddProductSchema = z.infer<typeof productInsertSchema>;
export default function AddProduct() {
  const router = useRouter();
  const { data, isLoading } = useSuspenseQuery(
    trpc.productrouter.add.queryOptions(),
  );
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
      mainImage: "",
      image2: "",
      image3: "",
      image4: "",
      image5: "",
    },
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-10">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const onSubmit = async (data: AddProductSchema) => {
    const file = await uploadToCloudinary(
      [data.mainImage, data.image2, data.image3, data.image4, data.image5],
      "products",
    );
    mutate(
      {
        ...data,
        mainImage: file[0] ?? "",
        image2: file[1] ?? "",
        image3: file[2] ?? "",
        image4: file[3] ?? "",
        image5: file[4] ?? "",
      },
      {
        onSuccess: (data) => {
          if (data.success) {
            Alert.alert(data.message);
            queryClient.invalidateQueries({
              queryKey: trpc.productrouter.showProduct.queryKey(),
            });
            router.replace("/(root)/profile/product");
          }
        },
        onError: (error) => {
          if (isTRPCClientError(error)) {
            Alert.alert(error.message);
          }
          console.error("Error", error.message);
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
      error: errors.productName?.message,
    },
    {
      control,
      name: "rate",
      label: "Product Price",
      component: "input",
      type: "number",
      keyboardType: "numeric",
      placeholder: "Product Price",
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
      className: "w-[90%] bg-base-100",
      component: "editor",
      placeholder: "Offer Description",
      error: errors.productDescription?.message,
    },
  ];
  const formFields2: FormFieldProps<AddProductSchema>[] = [
    {
      control,
      name: "mainImage",
      placeholder: "Select Image 1",
      component: "image",
      required: false,
      error: errors.mainImage?.message,
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
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={50}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          // flexGrow: 1,
          paddingHorizontal: 1,
          paddingVertical: 0,
        }}
      >
        <View className=" mx-auto w-[90%]">
          {formFields.map((field) => (
            <FormField key={field.name} {...field} />
          ))}
        </View>
        <View className="flex-row items-center ml-8 w-[90%]">
          <LableText title="Product Images" className="" />
          <Text style={{ color: "red" }} className="ml-1 mt-2">
            *
          </Text>
        </View>
        <View className="flex-row flex-wrap items-center gap-2 justify-center ">
          {formFields2.map((field) => (
            <FormField labelHidden key={field.name} {...field} />
          ))}
        </View>
        <View className="mt-2 flex-row flex-wrap items-center justify-center mx-auto w-[90%] gap-2 mb-4">
          <View className="w-[45%] mx-auto">
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
