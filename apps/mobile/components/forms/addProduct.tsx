import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm, useWatch } from "react-hook-form";
import {
  Alert,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { queryClient } from "@/app/_layout";
import {
  FormField,
  type FormFieldProps,
} from "@/components/forms/formComponent";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { CATEGORY_URL, MY_BUSINESS_LIST_URL } from "@/constants/apis";
import { addProductApi } from "@/query/addProduct";
import { useSuspenceData } from "@/query/getAllSuspense";
import {
  type AddProductSchemaType,
  addProductSchema,
} from "@/schemas/addProductSchema";
import { useFilterCategoryList } from "@/utils/getCategoryBaseOnType";
import { objectToFormData } from "@/utils/objectToFormData";

export default function AddProduct() {
  const router = useRouter();

  const { data: businessList } = useSuspenceData(
    MY_BUSINESS_LIST_URL.url,
    MY_BUSINESS_LIST_URL.key,
    "",
    true,
  );

  const { data: categoryList } = useSuspenceData(
    CATEGORY_URL.url,
    CATEGORY_URL.key,
  );

  const { list: businessCategoryList } = useFilterCategoryList(1);
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddProductSchemaType>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      product_name: "",
      rate: "",
      category_id: String(businessList?.data?.categories[0].id),
      subcategory_id: [],
      product_description: "",
      image1: undefined,
      image2: "",
      image3: "",
      image4: "",
      image5: "",
    },
  });

  const selectedCategoryId = useWatch({ control, name: "category_id" });

  const subCategoriesBasedOnCategory =
    categoryList?.subcategories?.filter(
      (sub: any) => String(sub.parent_id) === selectedCategoryId,
    ) ?? [];

  const onSubmit = async (data: AddProductSchemaType) => {
    const newData = { ...data, category_id: data.category_id};
    const formData = objectToFormData(newData);

    try {
      const response = await addProductApi(formData);

      if (response.success) {
        console.log("product added successfully");
        reset();
        queryClient.invalidateQueries({ queryKey: ["productList"] });
        router.navigate("/user/product");
      } else {
        Alert.alert(
          "error",
          response?.errors[0] ?? response?.errors ?? "something went wrong",
        );
      }
    } catch (error: any) {
      console.log(
        "something went wrong",
        error?.message || error?.error || error,
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
      placeholder: "Select Category",
      data: [
        ...(businessCategoryList || []).map((item) => ({
          label: item.title,
          value: String(item.id),
        })),
      ],
      onValueChange: () => {
        setValue("subcategory_id", []);
      },
      component: "dropdown",
      className: "w-[90%] bg-base-200",
      disable: true,
      error: errors.category_id?.message,
    },
    {
      control,
      name: "subcategory_id",
      label: "Sub Category",
      placeholder: "Select Sub Category",
      data: [
        ...subCategoriesBasedOnCategory.map((item: any) => ({
          label: item.name,
          value: String(item.id),
        })),
      ],
      component: "multiselectdropdown",
      multiselect: 10,
      className: "w-[90%] bg-base-200 ",
      error: errors.subcategory_id?.message,
    },
    {
      control,
      name: "product_description",
      label: "Product Description",
      component: "editor",
      error: errors.product_description?.message,
    },
  ];

  const formFields2: FormFieldProps[] = [
    {
      control,
      name: "image1",
      label: "",
      component: "image",
      onValueChange(value) {
        console.log("Value", value);
      },
      className: "",
      error: errors.image1?.message?.toString(),
    },
    {
      control,
      name: "image2",
      label: "",
      component: "image",
      className: "",
    },
    {
      control,
      name: "image3",
      label: "",
      component: "image",
    },
    {
      control,
      name: "image4",
      label: "",
      component: "image",
    },
    {
      control,
      name: "image5",
      label: "",
      component: "image",
    },
  ];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView className="w-[100%] h-full">
        <View className="mx-auto w-[90%]">
          {formFields.map((field, idx) => (
            <FormField key={idx.toString()} {...field} />
          ))}
        </View>
        <View className="mt-8 flex-1 flex-row flex-wrap items-center justify-center m-auto w-[80%] gap-4">
          {formFields2.map((field, idx) => (
            <FormField labelHidden key={idx.toString()} {...field} />
          ))}
        </View>
        <View className="w-[37%] mx-auto m-4">
          <PrimaryButton
            isLoading={isSubmitting}
            title="Submit"
            loadingText="Submitting..."
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
  );
}
