import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Alert, ScrollView, useColorScheme, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";
import {
  FormField,
  type FormFieldProps,
} from "@/components/forms/formComponent";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { CATEGORY_URL, MY_BUSINESS_LIST_URL } from "@/constants/apis";
import { apiUrl } from "@/constants/Variable";
import { CategoryItem, useCategoryList } from "@/query/category";
import { useSuspenceData } from "@/query/getAllSuspense";
import { useOfferList } from "@/query/myOfferList";
import { updateOffer } from "@/query/updateOffer";
import {
  type AddOffersSchemaType,
  addOffersSchema,
} from "@/schemas/addOffersSchema";
import { useAuthStore } from "@/store/authStore";
import { useFilterCategoryList } from "@/utils/getCategoryBaseOnType";
import { objectToFormData } from "@/utils/objectToFormData";

export default function UpdateOffers() {
  const colorScheme = useColorScheme();

  const { data: businessList } = useSuspenceData(
    MY_BUSINESS_LIST_URL.url,
    MY_BUSINESS_LIST_URL.key,
    "",
    true,
  );
  const token = useAuthStore((state) => state.token);
  const { data: offerList, isLoading } = useOfferList();
  const { data: categoryList, refetch } = useSuspenceData(
    CATEGORY_URL.url,
    CATEGORY_URL.key,
  );
  const { list: businessCategoryList } = useFilterCategoryList(1);
  const router = useRouter();
  const para = useLocalSearchParams();
  const editofferId = para.editoffer;

  const offers = offerList?.pages.flatMap((page) => page.data);
  const offer = offers?.find((item) => item.id == Number(editofferId));

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<AddOffersSchemaType>({
    resolver: zodResolver(addOffersSchema),
    defaultValues: {
      product_name: offer.product_name,
      rate: offer.rate,
      discount_percent: offer.discount_percent,
      final_price: offer.final_price,
      category_id: String(businessList?.data?.categories[0].id),
      subcategory_id: offer.subcategories.map((sub: any) => String(sub.id)),
      // product_description: offer.product_description,
      image1: offer.image1 && `${apiUrl}/assets/images/${offer.image1}`,
      image2: offer.image2 && `${apiUrl}/assets/images/${offer.image2}`,
      image3: offer.image3 && `${apiUrl}/assets/images/${offer.image3}`,
      image4: offer.image4 && `${apiUrl}/assets/images/${offer.image4}`,
      image5: offer.image5 && `${apiUrl}/assets/images/${offer.image5}`,
    },
  });

  const selectedCategoryId = useWatch({ control, name: "category_id" });
  const subCategoriesBasedOnCategory =
    categoryList?.subcategories?.filter(
      (sub: any) => String(sub.parent_id) === selectedCategoryId,
    ) ?? [];

  const onSubmit = async (data: AddOffersSchemaType) => {
    const formData = objectToFormData(data);

    // Submit to backend
    try {
      const response = await updateOffer(formData, String(editofferId));
      if (response.success) {
        Alert.alert("Offer updated successfully");
        router.replace("/user/offers");
      } else {
        console.log(response);
        Alert.alert(
          "something went wrong",
          response?.data?.error && response?.data?.error,
        );
      }
    } catch (error) {
      console.log("Error updating offer:", error);
    }

    router.replace("/user/offers");
  };

  if (isLoading) return <ActivityIndicator />;

  const formFields: FormFieldProps[] = [
    {
      control,
      name: "product_name",
      label: "Product Name",
      component: "input",
      placeholder: "Product Name",
      className: "w-[90%] bg-base-200",
      error: errors.product_name?.message,
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
      onValueChange: (value) => {
        if (!value) return;
        setValue("final_price", value);
      },
    },
    {
      control,
      name: "discount_percent",
      label: "Discount",
      component: "input",
      keyboardType: "numeric",
      placeholder: "e.g. 10",
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
      label: "Final Price",
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
      component: "dropdown",
      placeholder: "Select Category",
      data: [
        ...businessCategoryList.map((item) => ({
          label: item.title,
          value: item.id.toString(),
        })),
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
      component: "editor",
      placeholder: "Product Description",
      className: "w-[90%] bg-base-200",
      error: errors.product_description?.message,
    },
  ];

  const formFields2: FormFieldProps[] = [
    {
      control,
      name: "image1",
      label: "",
      component: "image",
      className: "",
      error: errors.image1?.message?.toString(),
    },
    {
      control,
      name: "image2",
      label: "",
      component: "image",
      className: "",
      error: errors.image2?.message?.toString(),
    },
    {
      control,
      name: "image3",
      label: "",
      component: "image",
      error: errors.image3?.message?.toString(),
    },
    {
      control,
      name: "image4",
      label: "",
      component: "image",
      error: errors.image4?.message?.toString(),
    },
    {
      control,
      name: "image5",
      label: "",
      component: "image",
      error: errors.image5?.message?.toString(),
    },
  ];
  return (
    <GestureHandlerRootView>
      <Stack.Screen
        options={{
          title: "Edit Offer",
        }}
      />
      <ScrollView className="w-full h-full" keyboardShouldPersistTaps="handled">
        <View className="mx-auto w-[90%]">
          {formFields.map((field, idx) => (
            <FormField key={idx} {...field} />
          ))}
        </View>
        <View className="mt-8 flex-row flex-wrap items-center justify-center w-[80%] mx-auto gap-4">
          {formFields2.map((field, idx) => (
            <FormField key={idx} labelHidden {...field} />
          ))}
        </View>
        <View className="w-[37%] m-auto my-4">
          <PrimaryButton
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
            // disabled={isSearching}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}
