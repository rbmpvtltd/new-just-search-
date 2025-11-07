import { zodResolver } from "@hookform/resolvers/zod";
import { productInsertSchema } from "@repo/db/src/schema/product.schema";
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
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { type OutputTrpcType, trpc } from "@/lib/trpc";
import { useAuthStore } from "@/store/authStore";

type EditProductSchema = z.infer<typeof productInsertSchema>;
type EditProductType = OutputTrpcType["productrouter"]["edit"] | null;
export default function EditProduct({
  myProduct,
}: {
  myProduct: EditProductType;
}) {
  const token = useAuthStore((state) => state.token);
  const { data, error, isLoading, isError } = useQuery(
    trpc.productrouter.add.queryOptions(),
  );
  const { mutate } = useMutation(
    trpc.productrouter.addProduct.mutationOptions(),
  );

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
      photo: myProduct?.product.productPhotos[0]?.photo || "",
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

  const onSubmit = async (data: EditProductSchema) => {
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
      label: "Offer Price",
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
      name: "productDescription",
      label: "Offer Description",
      component: "editor",
      keyboardType: "default",
      placeholder: "Offer Description",
      className: "w-[90%] bg-base-200",
      error: errors.productDescription?.message,
    },
  ];
  const formFields2: FormFieldProps<EditProductSchema>[] = [
    {
      control,
      name: "photo",
      label: "",
      placeholder: "Select Image 1",
      component: "image",
      className: "",
      error: errors.photo?.message,
    },
    {
      control,
      name: "image2",
      label: "",
      placeholder: "Select Image 2",
      component: "image",
      className: "",
      error: errors.image2?.message,
    },
    {
      control,
      name: "image3",
      label: "",
      placeholder: "Select Image 3",
      component: "image",
      error: errors.image3?.message,
    },
    {
      control,
      name: "image4",
      label: "",
      placeholder: "Select Image 4",
      component: "image",
      error: errors.image4?.message,
    },
    {
      control,
      name: "image5",
      label: "",
      placeholder: "Select Image 5",
      component: "image",
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
        <View className="mt-8 flex-1 flex-row flex-wrap items-center justify-center m-auto w-[80%] gap-4">
          {formFields2.map((field) => (
            <FormField labelHidden key={field.name} {...field} />
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
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
