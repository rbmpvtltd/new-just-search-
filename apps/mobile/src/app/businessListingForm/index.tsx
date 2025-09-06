import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import {
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  FormField,
  type FormFieldProps,
} from "@/components/forms/formComponent";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { CATEGORY_URL } from "@/constants/apis";
import { useSuspenceData } from "@/query/getAllSuspense";
import {
  type BusinessDetailData,
  businessDetailSchema,
} from "@/schemas/businessDetailSchema";
import useBusinessFormValidationStore from "@/store/businessFormStore";
import { useFilterCategoryList } from "@/utils/getCategoryBaseOnType";
export default function BusinessListing() {
  const setPage = useBusinessFormValidationStore((s) => s.setPage);
  const setFormValue = useBusinessFormValidationStore((s) => s.setFormValue);
  const { data: categoryList } = useSuspenceData(
    CATEGORY_URL.url,
    CATEGORY_URL.key,
  );
  const { list: businessCategoryList } = useFilterCategoryList(1);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BusinessDetailData>({
    resolver: zodResolver(businessDetailSchema),
    defaultValues: {
      name: "",
      photo: "",
      category_id: "",
      subcategory_id: [],
      specialities: "",
      home_delivery: "",
      description: "",
      image1: undefined,
      image2: "",
      image3: "",
      image4: "",
      image5: "",
    },
  });

  const router = useRouter();

  // sort subcategories based on selected category
  const selectedCategoryId = useWatch({ control, name: "category_id" });
  const subCategoriesBasedOnCategory =
    categoryList?.subcategories?.filter(
      (sub: any) => String(sub.parent_id) === selectedCategoryId,
    ) ?? [];

  const onSubmit = (data: BusinessDetailData) => {
    setFormValue("name", data.name ?? "");
    setFormValue("photo", data.photo ?? "");
    setFormValue("category_id[]", data.category_id ?? "");
    setFormValue("subcategory_id", data.subcategory_id ?? "");
    setFormValue("specialities", data.specialities ?? "");
    setFormValue("home_delivery", data.home_delivery ?? "");
    setFormValue("description", data.description ?? "");
    setFormValue("image1", data.image1 ?? "");
    setFormValue("image2", data.image2 ?? "");
    setFormValue("image3", data.image3 ?? "");
    setFormValue("image4", data.image4 ?? "");
    setFormValue("image5", data.image5 ?? "");

    setPage(1);
    router.push("/businessListingForm/addressDetail");
  };

  const formFields: FormFieldProps[] = [
    {
      control,
      name: "name",
      label: "Business Name",
      placeholder: "Enter your Business Name",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.name?.message,
    },
    {
      control,
      name: "photo",
      label: "Business Image",
      component: "image",
      className: "mx-auto w-[90%]",
      error: errors.photo?.message,
    },

    {
      control,
      name: "category_id",
      label: "Category",
      placeholder: "Select Category",
      data: [
        ...(businessCategoryList ?? []).map((item, index) => ({
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
      error: errors.category_id?.message,
    },
    {
      control,
      name: "subcategory_id",
      label: "Sub Category",
      placeholder: "Select Sub Category",
      data: [
        ...(subCategoriesBasedOnCategory ?? []).map((item, index) => ({
          label: item.name,
          value: String(item.id),
        })),
      ],
      component: "multiselectdropdown",
      className: "w-[90%] bg-base-200",
      error: errors.subcategory_id?.message,
    },

    {
      control,
      name: "specialities",
      label: "Specialities",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.specialities?.message,
    },
    {
      control,
      name: "home_delivery",
      label: "Home Delivery",
      component: "dropdown",
      data: [
        { label: "No", value: "yes" },
        { label: "Yes", value: "yes" },
      ],
      dropdownPosition: "top",
      error: errors.home_delivery?.message,
    },
    {
      control,
      name: "description",
      label: "About Your Business",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.description?.message,
    },
  ];

  const formFields2: FormFieldProps[] = [
    {
      control,
      name: "image1",
      label: "",
      component: "image",
      error: errors.image1?.message?.toString(),
    },
    {
      control,
      name: "image2",
      label: "",
      component: "image",
      error: errors.image2?.message?.toString(),
    },
    {
      control,
      name: "image3",
      label: "",
      component: "image",
      error: errors.photo?.message?.toString(),
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
      error: errors.image3?.message?.toString(),
    },
  ];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        className="w-[100%] h-full"
        extraScrollHeight={0}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        <View className=" mx-auto w-[90%]">
          {formFields.map((field, idx) => (
            <FormField key={idx} {...field} />
          ))}
        </View>
        <View className="mt-8 flex-row flex-wrap items-center justify-center mx-auto w-[90%] gap-2     ">
          {formFields2.map((field, idx) => (
            <FormField labelHidden key={idx} {...field} />
          ))}
        </View>
        <View className="w-[37%] mx-auto m-4">
          <PrimaryButton
            isLoading={isSubmitting}
            title="Next"
            loadingText="Processing..."
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
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}
