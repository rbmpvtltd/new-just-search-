import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  Alert,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  FormField,
  type FormFieldProps,
} from "@/components/forms/formComponent";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { CATEGORY_URL, MY_BUSINESS_LIST_URL } from "@/constants/apis";
import { apiUrl } from "@/constants/Variable";
import { useSuspenceData } from "@/query/getAllSuspense";
import { useProductList } from "@/query/myProductList";
import { updateProduct } from "@/query/updateProduct";
import {
  type AddProductSchemaType,
  addProductSchema,
} from "@/schemas/addProductSchema";
import { useAuthStore } from "@/store/authStore";
import { useFilterCategoryList } from "@/utils/getCategoryBaseOnType";
import { objectToFormData } from "@/utils/objectToFormData";

export default function UpdateProduct() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const { data: productList } = useProductList();
  const { data: categoryList } = useSuspenceData(
    CATEGORY_URL.url,
    CATEGORY_URL.key,
  );
  const { data: businessList } = useSuspenceData(
    MY_BUSINESS_LIST_URL.url,
    MY_BUSINESS_LIST_URL.key,
    "",
    true,
  );
  const { list: businessCategoryList } = useFilterCategoryList(1);

  const para: any = useLocalSearchParams();
  const products = productList?.pages.flatMap((page) => page.data) ?? [];
  const product = products?.find((item: any) => item.id == para.editProduct);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddProductSchemaType>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      product_name: product.product_name,
      rate: product.rate.toString(),
      category_id: String(businessList?.data?.categories[0].id),
      subcategory_id: product.subcategories.map((sub: any) => String(sub.id)),
      // product_description: product.product_description,
      image1: product.image1 && `${apiUrl}/assets/images/${product.image1}`,
      image2: product.image2 && `${apiUrl}/assets/images/${product.image2}`,
      image3: product.image3 && `${apiUrl}/assets/images/${product.image3}`,
      image4: product.image4 && `${apiUrl}/assets/images/${product.image4}`,
      image5: product.image5 && `${apiUrl}/assets/images/${product.image5}`,
    },
  });

  const selectedCategoryId = useWatch({ control, name: "category_id" });

  const subCategoriesBasedOnCategory =
    categoryList?.subcategories?.filter(
      (sub: any) => String(sub.parent_id) === selectedCategoryId,
    ) ?? [];

  const onSubmit = async (data: AddProductSchemaType) => {
    const formData = objectToFormData(data);
    // Submit to backend
    try {
      const response = await updateProduct(
        formData,
        token ?? "",
        String(para.editProduct),
      );

      if (response.success) {
        router.push("/user/product");
        reset();
      } else {
        Alert.alert(
          "Something went wrong",
          "Profile is not updated successfully, Please try again",
        );
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Something went wrong",
        "Profile is not updated successfully, Please try again",
      );
    }
  };

  const formFields: FormFieldProps[] = [
    {
      control,
      name: "product_name",
      label: "Product Name",
      placeholder: "Enter Product Name",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.product_name?.message,
    },
    {
      control,
      name: "rate",
      label: "Product Price",
      placeholder: "Enter Product Price",
      keyboardType: "numeric",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.rate?.message,
    },
    {
      control,
      name: "category_id",
      label: "Category",
      component: "dropdown",
      placeholder: "Select Category",
      data: [
        ...(businessCategoryList.map((item) => ({
          label: item.title,
          value: item.id.toString(),
        })) ?? []),
      ],
      className: "w-[90%] bg-base-200",
      disable: true,
      error: errors.category_id?.message,
    },
    {
      control,
      name: "subcategory_id",
      label: "Sub Category",
      component: "multiselectdropdown",
      placeholder: "Select Sub Category",
      data: [
        ...subCategoriesBasedOnCategory.map((item: any) => ({
          label: item.name,
          value: String(item.id),
        })),
      ],
      className: "w-[90%] bg-base-200",
      error: errors.subcategory_id?.message,
    },
    {
      control,
      name: "product_description",
      label: "Product Description",
      placeholder: "Enter Product Description",
      component: "editor",
      className: "w-[90%] bg-base-200",
      error: errors.product_description?.message,
    },
  ];

  const formFields2: FormFieldProps[] = [
    {
      control,
      name: "image1",
      label: "",
      // placeholder: 'Enter Image 2',
      component: "image",
      className: "",
      error: errors.image1?.message?.toString(),
    },
    {
      control,
      name: "image2",
      label: "",
      // placeholder: 'Enter Image 3',
      component: "image",
      className: "",
      error: errors.image2?.message?.toString(),
    },
    {
      control,
      name: "image3",
      label: "",
      // placeholder: 'Enter Image 2',
      component: "image",
      error: errors.image3?.message?.toString(),
    },
    {
      control,
      name: "image4",
      label: "",
      // placeholder: 'Enter Image 3',
      component: "image",
      error: errors.image4?.message?.toString(),
    },
    {
      control,
      name: "image5",
      label: "",
      // placeholder: 'Enter Image 4',
      component: "image",
      error: errors.image5?.message?.toString(),
    },
  ];
  return (
    <>
      <Stack.Screen
        options={{
          title: "Edit Product",
        }}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView className="w-[100%] h-full">
          <View className="mx-auto w-[90%]">
            {formFields.map((field, idx) => (
              <FormField key={idx} {...field} />
            ))}
          </View>
          <View className="flex-1 flex-row flex-wrap items-center justify-center m-auto w-[80%] gap-4">
            {formFields2.map((field, idx) => (
              <FormField labelHidden key={idx} {...field} />
            ))}
          </View>
          <View className="w-[37%] mx-auto m-6">
            <PrimaryButton
              isLoading={isSubmitting}
              title="Update"
              loadingText="Updating..."
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
        </ScrollView>
      </TouchableWithoutFeedback>
    </>
  );
}
