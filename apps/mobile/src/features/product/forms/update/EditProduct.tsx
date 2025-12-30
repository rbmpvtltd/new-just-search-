import { zodResolver } from "@hookform/resolvers/zod";
import { productInsertSchema } from "@repo/db/dist/schema/product.schema";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { isTRPCClientError } from "@trpc/client";
import { useRouter } from "expo-router";
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
import type z from "zod";
import { fa } from "zod/v4/locales";
import { uploadToCloudinary } from "@/components/cloudinary/cloudinary";
import {
  FormField,
  type FormFieldProps,
} from "@/components/forms/formComponent";
import LableText from "@/components/inputs/LableText";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { useAuthStore } from "@/features/auth/authStore";
import { type OutputTrpcType, queryClient, trpc } from "@/lib/trpc";

type EditProductSchema = z.infer<typeof productInsertSchema>;
type EditProductType = OutputTrpcType["productrouter"]["edit"] | null;
export default function EditProduct({
  myProduct,
}: {
  myProduct: EditProductType;
}) {
  const router = useRouter();
  const { data } = useSuspenseQuery(trpc.productrouter.add.queryOptions());
  const { mutate } = useMutation(trpc.productrouter.update.mutationOptions());

  const categories = data?.categoryRecord;
  const subCategories = data?.subcategoryRecord;
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditProductSchema>({
    resolver: zodResolver(productInsertSchema),
    defaultValues: {
      productName: myProduct?.product?.productName,
      rate: myProduct?.product?.rate,
      productDescription: myProduct?.product?.productDescription,
      mainImage: myProduct?.product.mainImage || "",
      image2: myProduct?.product.productPhotos[1]?.photo || "",
      image3: myProduct?.product.productPhotos[2]?.photo || "",
      image4: myProduct?.product.productPhotos[3]?.photo || "",
      image5: myProduct?.product.productPhotos[4]?.photo || "",
      categoryId: myProduct?.product.categoryId,
      subcategoryId: myProduct?.product.productSubCategories.map(
        (item) => item.subcategoryId,
      ),
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

  const onSubmit = async (data: EditProductSchema) => {
    const file = await uploadToCloudinary(
      [data.mainImage, data.image2, data.image3, data.image4, data.image5],
      "products",
    );
    mutate(
      {
        ...data,
        mainImage: file[0] ?? data.mainImage,
        image2: file[1] ?? data.image2,
        image3: file[2] ?? data.image3,
        image4: file[3] ?? data.image4,
        image5: file[4] ?? data.image5,
        id: myProduct?.product.id,
      },
      {
        onSuccess: (data) => {
          if (data.success) {
            Alert.alert(data.message);
            queryClient.invalidateQueries({
              queryKey: trpc.productrouter.showProduct.queryKey(),
            });
            router.replace("/(root)/profile");
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

  const formFields: FormFieldProps<EditProductSchema>[] = [
    {
      control,
      name: "productName",
      label: "Product Name",
      component: "input",
      keyboardType: "default",
      placeholder: "Offer Name",
      className: "w-[90%] bg-base-200",
      error: errors.productName?.message,
    },
    {
      control,
      name: "rate",
      label: "Product Price",
      component: "input",
      keyboardType: "numeric",
      placeholder: "Offer Price",
      className: "w-[90%] bg-base-200",
      error: errors.rate?.message,
    },
    {
      control,
      name: "categoryId",
      label: "Category",
      placeholder: "Select Category",
      data: categories
        ? [{ label: categories.title, value: categories.id }]
        : [],
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
      name: "productDescription",
      label: "Product Description",
      component: "editor",
      keyboardType: "default",
      placeholder: "Offer Description",
      error: errors.productDescription?.message,
    },
  ];
  const formFields2: FormFieldProps<EditProductSchema>[] = [
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={60}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 12,
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
        <View className="mt-2 flex-row flex-wrap items-center mx-auto w-[90%] gap-2">
          {formFields2.map((field) => (
            <FormField key={field.name} {...field} />
          ))}
        </View>
        <View className="flex-row justify-between w-[90%] self-center mt-6 mb-2">
          <View className="w-[45%] mx-auto">
            <PrimaryButton
              title="Next"
              isLoading={isSubmitting}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}
