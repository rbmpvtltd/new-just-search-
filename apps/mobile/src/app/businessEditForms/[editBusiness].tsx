import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { CATEGORY_URL, MY_BUSINESS_LIST_URL } from "@/constants/apis";
import { apiUrl } from "@/constants/Variable";
import { useSuspenceData } from "@/query/getAllSuspense";
import {
  type BusinessDetailData,
  businessDetailSchema,
} from "@/schemas/businessDetailSchema";
import useBusinessFormValidationStore from "@/store/businessFormStore";
import { useFilterCategoryList } from "@/utils/getCategoryBaseOnType";
export default function BusinessDetail() {
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
  const setFormValue = useBusinessFormValidationStore((s) => s.setFormValue);
  const { editBusiness } = useLocalSearchParams();
  const { list: businessCategoryList } = useFilterCategoryList(1);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BusinessDetailData>({
    resolver: zodResolver(businessDetailSchema),
    defaultValues: {
      photo:
        businessList?.data?.photo &&
        `${apiUrl}/assets/images/${businessList?.data?.photo}`,
      name: businessList?.data?.name,
      category_id: String(businessList?.data?.categories[0].id),
      subcategory_id: businessList?.data?.subcategories.map((sub: any) =>
        String(sub.id),
      ),
      specialities: businessList?.data?.specialities ?? "",
      home_delivery: businessList?.data?.home_delivery,
      description: businessList?.data?.description,
      image1:
        businessList?.data?.image1 &&
        `${apiUrl}/assets/images/${businessList?.data?.image1}`,
      image2:
        businessList?.data?.image2 &&
        `${apiUrl}/assets/images/${businessList?.data?.image2}`,
      image3:
        businessList?.data?.image3 &&
        `${apiUrl}/assets/images/${businessList?.data?.image3}`,
      image4:
        businessList?.data?.image4 &&
        `${apiUrl}/assets/images/${businessList?.data?.image4}`,
      image5:
        businessList?.data?.image5 &&
        `${apiUrl}/assets/images/${businessList?.data?.image5}`,
    },
  });

  const router = useRouter();

  const selectedCategoryId = useWatch({ control, name: "category_id" });
  const subCategoriesBasedOnCategory =
    categoryList?.subcategories?.filter(
      (sub: any) => String(sub.parent_id) == selectedCategoryId,
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

    router.push({
      pathname: "/businessEditForms/editAddressDetail",
      params: { editBusiness: editBusiness },
    });
  };

  const formFields: FormFieldProps[] = [
    {
      control,
      name: "name",
      label: "Business Name",
      placeholder: "Enter your Business Name",
      component: "input",
      editable: false,
      className: "w-[90%] bg-base-200",
      error: errors.name?.message,
    },
    {
      control,
      name: "photo",
      label: "Business Image",
      component: "image",
      className: "w-[100%] ",
      error: errors.photo?.message,
    },

    {
      control,
      name: "category_id",
      label: "Category",
      placeholder: "Select Category",
      data: businessCategoryList.map((item, index) => ({
        label: item.title,
        value: String(item.id),
      })),
      onValueChange: () => {
        setValue("subcategory_id", []);
      },
      component: "dropdown",
      disable: true,
      className: "w-[90%] bg-base-200",

      error: errors.category_id?.message,
    },
    {
      control,
      name: "subcategory_id",
      label: "Sub Category",
      placeholder: "Select Sub Category",
      data: [
        ...subCategoriesBasedOnCategory.map((item: any, index) => ({
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
        { label: "Select Home Delivery", value: "" },
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
      dropdownPosition: "top",
      error: errors.home_delivery?.message,
    },
    {
      control,
      name: "description",
      label: "About Your Business",
      component: "textarea",
      className: "mx-auto w-[90%] bg-base-200",
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
          {formFields.map((field, index) => (
            <FormField key={index.toString()} {...field} />
          ))}
        </View>
        <View className="mt-8 flex-1 flex-row flex-wrap items-center justify-center m-auto w-[80%] gap-4">
          {formFields2.map((field, idx) => (
            <FormField labelHidden key={idx.toString()} {...field} />
          ))}
        </View>
        <View className="w-[37%] mx-auto m-6">
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
