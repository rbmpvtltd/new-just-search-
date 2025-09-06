import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm, useWatch } from "react-hook-form";
import {
  Alert,
  Keyboard,
  ScrollView,
  Text,
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
import { addOfferApi } from "@/query/addOfferApi";
import { useSuspenceData } from "@/query/getAllSuspense";
import {
  type AddOffersSchemaType,
  addOffersSchema,
} from "@/schemas/addOffersSchema";
import { useAuthStore } from "@/store/authStore";
import { useFilterCategoryList } from "@/utils/getCategoryBaseOnType";
import { objectToFormData } from "@/utils/objectToFormData";

export default function AddOffer() {
  const token = useAuthStore((state) => state.token);
  const { list: businessCategoryList } = useFilterCategoryList(1);
  const router = useRouter();

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
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddOffersSchemaType>({
    resolver: zodResolver(addOffersSchema),
    defaultValues: {
      product_name: "",
      rate: "",
      discount_percent: "",
      final_price: "",
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

  const onSubmit = async (data: AddOffersSchemaType) => {
    const newData = { ...data, category_id: data.category_id };
    const finalData = objectToFormData(newData);
    const response = await addOfferApi(finalData, token ?? "");

    if (response.success) {
      queryClient.invalidateQueries({ queryKey: ["offerList"] });
      Alert.alert("Offer added successfully");
      reset();
      router.navigate("/user/offers");
    } else {
      Alert.alert(
        "error",
        response?.message ??
          response?.error ??
          response.errors[0] ??
          "server error",
      );
      console.log(response, "Something went wrong");
    }
  };

  const formFields: FormFieldProps[] = [
    {
      control,
      name: "product_name",
      label: "Offer Name",
      component: "input",
      keyboardType: "default",
      placeholder: "Offer Name",
      className: "w-[90%] bg-base-200",
      error: errors.product_name?.message,
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
        setValue("final_price", value);
      },
    },
    {
      control,
      name: "discount_percent",
      label: " Discount",
      component: "input",
      keyboardType: "numeric",
      placeholder: "e.g 10",
      className: "w-[90%] bg-base-200",
      error: errors.discount_percent?.message,
      onValueChange: (value) => {
        if (!value) return;
        const discount = parseFloat(value);
        const price = parseFloat(getValues("rate") || "0");
        const final = (price * (100 - discount)) / 100;
        setValue("discount_percent", value);
        setValue("final_price", final.toFixed(2));
      },
    },
    {
      control,
      name: "final_price",
      label: " Final Price",
      component: "input",
      keyboardType: "numeric",
      placeholder: "Final Price",
      className: "w-[90%] bg-base-200",
      error: errors.final_price?.message,
    },
    {
      control,
      name: "category_id",
      label: "Category",
      placeholder: "Select Category",
      data: [
        ...(businessCategoryList ?? []).map((item) => ({
          label: item.title,
          value: String(item.id),
        })),
      ],
      onValueChange: () => {
        setValue("subcategory_id", []);
      },
      component: "dropdown",
      multiselect: 1,
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
      multiselect: Infinity,
      className: "w-[90%] bg-base-200",
      error: errors?.subcategory_id?.message,
    },
    {
      control,
      name: "product_description",
      label: "Offer Description",
      component: "editor",
      keyboardType: "default",
      placeholder: "Offer Description",
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView className="w-[100%] h-full">
        <View className=" mx-auto w-[90%]">
          {formFields.map((field, idx) => (
            <FormField key={idx} {...field} />
          ))}
        </View>
        <View className="mt-8 flex-1 flex-row flex-wrap items-center justify-center m-auto w-[80%] gap-4">
          {formFields2.map((field, idx) => (
            <FormField labelHidden key={idx} {...field} />
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
