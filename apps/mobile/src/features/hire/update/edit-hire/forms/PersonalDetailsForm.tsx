import { zodResolver } from "@hookform/resolvers/zod";
import { uploadOnCloudinary } from "@repo/cloudinary";
import {
  Gender,
  MaritalStatus,
  personalDetailsHireSchema,
} from "@repo/db/src/schema/hire.schema";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import type z from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/forms/formComponent";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import LocationAutoDetect from "@/components/ui/LocationAutoDetect";
import { useHireFormStore } from "@/features/hire/shared/store/useCreateHireStore";
import { trpc } from "@/lib/trpc";
import type { FormReferenceDataType, UserHireListingType } from "..";

type PersonalDetailsSchema = z.infer<typeof personalDetailsHireSchema>;

export default function PersonalDetailsForm({
  hireListing,
  formReferenceData,
}: {
  hireListing: UserHireListingType;
  formReferenceData: FormReferenceDataType;
}) {
  const setFormValue = useHireFormStore((s) => s.setFormValue);
  const nextPage = useHireFormStore((s) => s.nextPage);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PersonalDetailsSchema>({
    resolver: zodResolver(personalDetailsHireSchema),
    defaultValues: {
      photo: "",
      name: hireListing?.name ?? "",
      categoryId: hireListing?.categoryId.id ?? 0,
      subcategoryId: hireListing?.subcategoryId.map((item) => item.id) ?? [],
      email: hireListing?.email ?? "",
      gender: hireListing?.gender ?? "Male",
      maritalStatus: hireListing?.maritalStatus ?? "Married",
      fatherName: hireListing?.fatherName ?? "",
      dob: hireListing?.dob ?? "",
      languages: hireListing?.languages ?? [],
      mobileNumber: hireListing?.mobileNumber ?? "",
      alternativeMobileNumber: hireListing?.alternativeMobileNumber ?? "",
      latitude: hireListing?.latitude ?? "",
      longitude: hireListing?.longitude ?? "",
      area: hireListing?.area ?? "",
      pincode: hireListing?.pincode ?? "",
      state: hireListing?.state.id ?? 0,
      city: hireListing?.city.id ?? 0,
    },
  });

  const categories = formReferenceData?.getHireCategories.map((item: any) => {
    return {
      label: item.title,
      value: item.id,
    };
  });

  const selectedCategoryId = useWatch({ control, name: "categoryId" });

  const { data: subCategories, isLoading } = useQuery(
    trpc.hirerouter.getSubCategories.queryOptions({
      categoryId: selectedCategoryId,
    }),
  );

  const states = formReferenceData?.getStates.map((item: any) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  const selectedStateId = useWatch({ control, name: "state" });

  const { data: cities, isLoading: cityLoading } = useQuery(
    trpc.hirerouter.getCities.queryOptions({
      state: Number(selectedStateId),
    }),
  );

  const onSubmit = async (data: PersonalDetailsSchema) => {
    setFormValue("photo", data.photo ?? "");
    setFormValue("name", data.name);
    setFormValue("categoryId", data.categoryId);
    setFormValue("subcategoryId", data.subcategoryId);
    setFormValue("email", data.email ?? "");
    setFormValue("gender", data.gender);
    setFormValue("maritalStatus", data.maritalStatus);
    setFormValue("fatherName", data.fatherName ?? "");
    setFormValue("dob", data.dob ?? "");
    setFormValue("languages", data.languages);
    setFormValue("mobileNumber", data.mobileNumber ?? "");
    setFormValue("alternativeMobileNumber", data.alternativeMobileNumber ?? "");
    setFormValue("latitude", data.latitude ?? "");
    setFormValue("longitude", data.longitude ?? "");
    setFormValue("area", data.area ?? "");
    setFormValue("pincode", data.pincode ?? "");
    setFormValue("state", data.state);
    setFormValue("city", data.city);
    nextPage();
  };

  const formFields: FormFieldProps<PersonalDetailsSchema>[] = [
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
      name: "categoryId",
      label: "Applied For",
      data: [
        ...(categories ?? []).map((item, index) => ({
          label: item.label,
          value: item.value,
        })),
      ],
      component: "dropdown",
      placeholder: "Select Category",
      error: errors.categoryId?.message,
    },
    {
      control,
      name: "subcategoryId",
      label: "Sub Category",
      data: [
        ...(subCategories ?? []).map((item, index) => ({
          label: item.name,
          value: item.id,
        })),
      ],
      component: "multiselectdropdown",
      dropdownPosition: "auto",
      placeholder: "Select Sub Category",
      error: errors.subcategoryId?.message,
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
      data: Object.values(Gender).map((item) => ({
        label: item,
        value: item,
      })),
      dropdownPosition: "top",
      placeholder: "Select Gender",
      error: errors.gender?.message,
    },
    {
      control,
      name: "maritalStatus",
      label: "Marital Status",
      component: "dropdown",
      data: Object.values(MaritalStatus).map((item) => {
        return {
          label: item,
          value: item,
        };
      }),
      dropdownPosition: "top",
      error: errors.maritalStatus?.message,
      placeholder: "Select Marital Status",
    },
    {
      control,
      name: "fatherName",
      label: "Father Name",
      placeholder: "Enter your Father Name",
      keyboardType: "default",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.fatherName?.message,
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
      data: [
        {
          label: "English",
          value: "English",
        },
      ],
      dropdownPosition: "top",
      placeholder: "Select Languages",
      error: errors.languages?.message,
    },
    {
      control,
      name: "mobileNumber",
      label: "Mobile Number",
      placeholder: "Enter your Mobile Number",
      keyboardType: "numeric",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.mobileNumber?.message,
    },
    {
      control,
      name: "alternativeMobileNumber",
      label: "Alternative Mobile Number",
      placeholder: "Enter your Alternative Mobile Number",
      keyboardType: "numeric",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.alternativeMobileNumber?.message,
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
      name: "area",
      label: "Address",
      placeholder: "Enter your Address",
      keyboardType: "default",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.area?.message,
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
        ...(states ?? []).map((state) => ({
          label: state.label,
          value: state.value,
        })),
      ],
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
        ...(cities ?? []).map((city) => ({
          label: city.city,
          value: city.id,
        })),
      ],
      dropdownPosition: "top",
      error: errors.city?.message,
    },
  ];
  return (
    // <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        className="w-[100%]"
        extraScrollHeight={0}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mx-auto w-[90%]">
          {formFields.map((field, idx) => (
            <React.Fragment key={idx.toString()}>
              <FormField {...field} />
              {/* {field.name === "alternativeMobileNumber" && (
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
                    let area = data.formattedAddress || "";

                    if (area.length > 100) {
                      area = area.slice(0, 99).trim();
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
                    setValue("area", area);

                    // Also update Zustand store
                    setFormValue("latitude", lat);
                    setFormValue("longitude", lng);
                    setFormValue("pincode", pincode);
                    setFormValue("city", city);
                    setFormValue("state", state);
                    setFormValue("area", area);
                  }}
                />
              )} */}
            </React.Fragment>
          ))}
        </View>

        <View className="flex-row justify-between w-[35%] self-center mt-6 mb-24">
          <PrimaryButton
            title="Next"
            onPress={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
          />
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
    // </SafeAreaView>
  );
}
