import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
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
import LocationAutoDetect from "@/components/ui/LocationAutoDetect";
import { CATEGORY_URL, CITY_STATE_URL, PROFILE_URL } from "@/constants/apis";
import { gender, languages, martialStatus, subcategory_id } from "@/data/dummy";
import { useSuspenceData } from "@/query/getAllSuspense";
import {
  type PersonalDetailsFormType,
  personalDetailsFormSchema,
} from "@/schemas/personalDetailsFormSchema";
import useFormValidationStore from "@/store/formHireStore";
import { useFilterCategoryList } from "@/utils/getCategoryBaseOnType";
import { objectToFormData } from "@/utils/objectToFormData";
export default function HireListing() {
  const setPage = useFormValidationStore((s) => s.setPage);
  const setFormValue = useFormValidationStore((s) => s.setFormValue);
  const { data: categoryList } = useSuspenceData(
    CATEGORY_URL.url,
    CATEGORY_URL.key,
  );

  const { data: userProfile } = useSuspenceData(
    PROFILE_URL.url,
    PROFILE_URL.key,
  );

  const { data: cityStateList } = useSuspenceData(
    CITY_STATE_URL.url,
    CITY_STATE_URL.key,
  );
  const { list: hireCategoryList } = useFilterCategoryList(2);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PersonalDetailsFormType>({
    resolver: zodResolver(personalDetailsFormSchema),
    defaultValues: {
      photo: "",
      name: "",
      category_id: "",
      subcategory_id: [],
      email: "",
      gender: "",
      marital_status: "",
      father_name: "",
      dob: new Date(),
      languages: [],
      phone_number: userProfile?.user?.phone,
      alternative_mobile_number: "",
      latitude: "",
      longitude: "",
      real_address: "",
      pincode: "",
      state: 0,
      city: 0,
    },
  });

  const router = useRouter();

  // sort city based on selected state
  const selectStatesId = useWatch({ control, name: "state" });
  const cityBasedOnStates =
    selectStatesId && cityStateList?.data?.cities
      ? cityStateList.data.cities.filter(
          (city: any) => city.state_id === selectStatesId,
        )
      : [];

  // sort subcategories based on selected category
  const selectedCategoryId = useWatch({ control, name: "category_id" });
  const subCategoriesBasedOnCategory =
    categoryList?.subcategories?.filter(
      (sub: any) => sub.parent_id == selectedCategoryId,
    ) ?? [];

  const onSubmit = (data: PersonalDetailsFormType) => {

    setFormValue("photo", data.photo);
    setFormValue("name", data.name ?? "");
    setFormValue("category_id", data.category_id);
    setFormValue("subcategory_id", data.subcategory_id);
    setFormValue("email", data.email);
    setFormValue("gender", data.gender);
    setFormValue("marital_status", data.marital_status);
    setFormValue("father_name", data.father_name);
    setFormValue("dob", data.dob ? data.dob.toISOString().split("T")[0] : "");
    setFormValue("languages", data.languages);
    setFormValue("phone_number", data.phone_number);
    setFormValue(
      "alternative_mobile_number",
      data.alternative_mobile_number ?? "",
    );
    setFormValue("latitude", data.latitude);
    setFormValue("longitude", data.longitude);
    setFormValue("real_address", data.real_address);
    setFormValue("pincode", data.pincode);
    setFormValue("state", data.state);
    setFormValue("city", data.city);

    setPage(1);
    router.push("/hirelistingforms/qualificationsAndSkills");
  };

  const formFields: FormFieldProps[] = [
    {
      control,
      name: "photo",
      label: "Profile Image",
      component: "image",
      className: "w-[90%]",
      error: errors.name?.message,
    },
    {
      control,
      name: "name",
      label: "Name",
      placeholder: "Enter your Name",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.name?.message,
    },
    {
      control,
      name: "category_id",
      label: "Applied For",
      data: [
        ...(hireCategoryList ?? []).map((item) => ({
          label: item.title,
          value: String(item.id),
        })),
      ],
      onValueChange: () => {
        setValue("subcategory_id", []);
      },
      component: "dropdown",
      placeholder: "Select Category",
      error: errors.category_id?.message,
    },
    {
      control,
      name: "subcategory_id",
      label: "Sub Category",
      data: [
        ...subCategoriesBasedOnCategory.map((item: any) => ({
          label: item.name,
          value: String(item.id),
        })),
      ],
      component: "multiselectdropdown",
      placeholder: "Select Sub Category",
      error: errors.subcategory_id?.message,
    },

    {
      control,
      name: "email",
      label: "Email",
      placeholder: "Enter your Email",
      keyboardType: "email-address",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.email?.message,
    },
    {
      control,
      name: "gender",
      label: "Gender",
      component: "dropdown",
      data: [...gender],
      dropdownPosition: "top",
      placeholder: "Select Gender",
      error: errors.gender?.message,
    },
    {
      control,
      name: "marital_status",
      label: "Marital Status",
      component: "dropdown",
      data: [...martialStatus],
      dropdownPosition: "top",
      error: errors.marital_status?.message,
      placeholder: "Select Marital Status",
    },
    {
      control,
      name: "father_name",
      label: "Father Name",
      placeholder: "Enter your Father Name",
      keyboardType: "default",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.father_name?.message,
    },
    {
      control,
      name: "dob",
      label: "Date of Birth",
      component: "datepicker",
      className: "w-[90%] bg-base-200",
      error: errors.dob?.message,
    },
    {
      control,
      name: "languages",
      label: "Languages",
      component: "multiselectdropdown",
      data: languages,
      dropdownPosition: "top",
      placeholder: "Select Languages",
      error: errors.languages?.message,
    },
    {
      control,
      name: "phone_number",
      label: "Mobile Number",
      placeholder: "Enter your Mobile Number",
      keyboardType: "numeric",
      component: "input",
      editable: false,
      className: "w-[90%] bg-base-200",
      error: errors.phone_number?.message,
    },
    {
      control,
      name: "alternative_mobile_number",
      label: "Alternative Mobile Number",
      placeholder: "Enter your Alternative Mobile Number",
      keyboardType: "numeric",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.alternative_mobile_number?.message,
    },
    {
      control,
      name: "latitude",
      label: "Latitude",
      placeholder: "e.g. 26.9124",
      keyboardType: "numeric",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.latitude?.message,
    },
    {
      control,
      name: "longitude",
      label: "Longitude",
      placeholder: "e.g. 75.7878",
      keyboardType: "numeric",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.longitude?.message,
    },
    {
      control,
      name: "real_address",
      label: "Address",
      placeholder: "Enter your Address",
      keyboardType: "default",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.real_address?.message,
    },
    {
      control,
      name: "pincode",
      label: "Pincode",
      placeholder: "Enter your Pincode",
      keyboardType: "numeric",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.pincode?.message,
    },
    {
      control,
      name: "state",
      label: "State",
      placeholder: "Enter your State",
      component: "dropdown",
      className: "w-[90%] bg-base-200 rounded-lg",
      data: [
        ...cityStateList.data.states.map((state: any) => ({
          label: state.name,
          value: state.id,
        })),
      ],
      onValueChange: () => {
        setValue("city", 0);
      },
      dropdownPosition: "top",
      error: errors.state?.message,
    },
    {
      control,
      name: "city",
      label: "City",
      placeholder: "Enter your City",
      component: "dropdown",
      className: "w-[90%] bg-base-200 rounded-lg",
      data: [
        ...cityBasedOnStates.map((city: any) => ({
          label: city.city,
          value: Number(city.id),
        })),
      ],
      dropdownPosition: "top",
      error: errors.city?.message,
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
        <View className="mx-auto w-[90%]">
          {formFields.map((field, idx) => (
            <React.Fragment key={idx.toString()}>
              <FormField {...field} />
              {field.name === "alternative_mobile_number" && (
                <LocationAutoDetect
                  onResult={(data) => {
                    if (!data.success) {
                      return;
                    }
                    const lat = data.latitude.toString();
                    const lng = data.longitude.toString();
                    const pincode = data.postalCode || "";
                    const cityName = data.city || "";
                    const stateName = data.region || "";
                    let real_address = data.formattedAddress || "";

                    if (real_address.length > 100) {
                      real_address = real_address.slice(0, 99).trim();
                    }

                    const matchedState = cityStateList?.data?.states.find(
                      (item: any) =>
                        item.name.toLowerCase() === stateName.toLowerCase(),
                    );

                    const matchedCity = cityStateList?.data?.cities.find(
                      (item: any) =>
                        item.city.toLowerCase() == cityName.toLowerCase() &&
                        item.state_id == matchedState?.id,
                    );

                    const state = matchedState?.id || "";
                    const city = matchedCity?.id || "";

                    // Set values in react-hook-form
                    setValue("latitude", lat);
                    setValue("longitude", lng);
                    setValue("pincode", pincode);
                    setValue("city", city);
                    setValue("state", state);
                    setValue("real_address", real_address);

                    // Also update Zustand store
                    setFormValue("latitude", lat);
                    setFormValue("longitude", lng);
                    setFormValue("pincode", pincode);
                    setFormValue("city", city);
                    setFormValue("state", state);
                    setFormValue("real_address", real_address);
                  }}
                />
              )}
            </React.Fragment>
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
