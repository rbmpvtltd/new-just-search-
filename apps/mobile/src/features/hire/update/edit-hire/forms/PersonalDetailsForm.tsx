import { zodResolver } from "@hookform/resolvers/zod";
import { Gender, MaritalStatus } from "@repo/db/dist/enum/allEnum.enum";
import { personalDetailsHireSchema } from "@repo/db/dist/schema/hire.schema";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { type FieldErrors, useForm, useWatch } from "react-hook-form";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import type z from "zod";
import { uploadToCloudinary } from "@/components/cloudinary/cloudinary";
import {
  FormField,
  type FormFieldProps,
} from "@/components/forms/formComponent";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { useHireFormStore } from "@/features/hire/shared/store/useCreateHireStore";
import { trpc } from "@/lib/trpc";
import type { UserHireListingType } from "..";

type PersonalDetailsSchema = z.infer<typeof personalDetailsHireSchema>;

export default function PersonalDetailsForm({
  hireListing,
}: {
  hireListing: UserHireListingType;
}) {
  const setFormValue = useHireFormStore((s) => s.setFormValue);
  const nextPage = useHireFormStore((s) => s.nextPage);
  const [detectedCityName, setDetectedCityName] = useState<null | string>(null);

  const {
    control,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<PersonalDetailsSchema>({
    resolver: zodResolver(personalDetailsHireSchema),
    defaultValues: {
      photo: hireListing?.hire?.photo ?? "",
      name: hireListing?.hire?.name ?? "",
      categoryId: hireListing?.category?.categoryId ?? 0,
      subcategoryId:
        hireListing?.subcategory?.map((item) => item.subcategoryId) ?? [],
      email: hireListing?.hire?.email ?? "",
      gender: hireListing?.hire?.gender ?? "Male",
      maritalStatus: hireListing?.hire?.maritalStatus ?? "Married",
      fatherName: hireListing?.hire?.fatherName ?? "",
      dob: hireListing?.hire?.dob ?? "",
      languages: hireListing?.hire?.languages ?? [],
      mobileNumber: hireListing?.hire?.mobileNumber ?? "",
      alternativeMobileNumber: hireListing?.hire?.alternativeMobileNumber ?? "",
      latitude: hireListing?.hire?.latitude ?? "",
      longitude: hireListing?.hire?.longitude ?? "",
      area: hireListing?.hire?.area ?? "",
      pincode: hireListing?.hire?.pincode ?? "",
      state: hireListing?.hire?.state ?? 0,
      city: hireListing?.hire?.city ?? 0,
    },
  });

  const selectedCategoryId = useWatch({ control, name: "categoryId" });
  const { data: subCategories } = useQuery(
    trpc.hirerouter.getSubCategories.queryOptions({
      categoryId: selectedCategoryId,
    }),
  );

  const states = hireListing?.getStates.map((item: any) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  const selectedStateId = useWatch({ control, name: "state" });
  const {
    data: cities,
    isLoading,
    isFetching,
  } = useQuery(
    trpc.businessrouter.getCities.queryOptions({
      state: selectedStateId,
    }),
  );

  useEffect(() => {
    if (
      !isLoading &&
      !isFetching &&
      cities &&
      cities.length > 0 &&
      detectedCityName
    ) {
      const matchedCity = cities?.find(
        (c) => c.city.toLowerCase() === detectedCityName.toLowerCase(),
      );
      if (matchedCity && matchedCity.id !== control._formValues.cityId) {
        setValue("city", matchedCity.id, { shouldValidate: true });
      }
    }
  }, [
    detectedCityName,
    control._formValues.cityId,
    isFetching,
    isLoading,
    setValue,
    cities,
  ]);

  const onSubmit = async (data: PersonalDetailsSchema) => {
    const file = await uploadToCloudinary([data.photo], "hire");
    setFormValue("photo", file[0] ?? "");
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
  const onError = (errors: FieldErrors<PersonalDetailsSchema>) => {
    const fisrtError = Object.keys(errors)[0] as keyof PersonalDetailsSchema;
    setFocus(fisrtError);
  };
  const formFields: FormFieldProps<PersonalDetailsSchema>[] = [
    {
      control,
      name: "photo",
      label: "Profile Image",
      component: "image",
      placeholder: "Select Image",
      className: "w-[90%]",
      error: errors.photo?.message,
    },
    {
      control,
      name: "name",
      label: "Name",
      placeholder: "Enter your Name",
      component: "input",
      error: errors.name?.message,
    },
    {
      control,
      name: "categoryId",
      label: "Applied For",
      data: hireListing?.getHireCategories.map((item) => {
        return {
          label: item.title,
          value: item.id,
        };
      }),
      component: "dropdown",
      placeholder: "Select Category",
      error: errors.categoryId?.message,
    },
    {
      control,
      name: "subcategoryId",
      label: "Sub Category",
      data: [
        ...(subCategories ?? []).map((item) => ({
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
      error: errors.fatherName?.message,
    },
    {
      control,
      name: "dob",
      label: "Date of Birth",
      component: "datepicker",
      error: errors.dob?.message,
    },
    {
      control,
      name: "languages",
      label: "Languages",
      component: "multiselectdropdown",
      data: hireListing?.getLanguages.map((item) => ({
        label: item.name,
        value: item.id,
      })),
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
      error: errors.mobileNumber?.message,
    },
    {
      control,
      name: "alternativeMobileNumber",
      label: "Alternative Mobile Number",
      placeholder: "Enter your Alternative Mobile Number",
      keyboardType: "numeric",
      component: "input",
      error: errors.alternativeMobileNumber?.message,
    },
    {
      control,
      name: "latitude",
      label: "Latitude",
      placeholder: "e.g. 26.9124",
      keyboardType: "numeric",
      component: "input",
      error: errors.latitude?.message,
    },
    {
      control,
      name: "longitude",
      label: "Longitude",
      placeholder: "e.g. 75.7878",
      keyboardType: "numeric",
      component: "input",
      error: errors.longitude?.message,
    },
    {
      control,
      name: "area",
      label: "Address",
      placeholder: "Enter your Address",
      keyboardType: "default",
      component: "input",
      error: errors.area?.message,
    },
    {
      control,
      name: "pincode",
      label: "Pincode",
      placeholder: "Enter your Pincode",
      keyboardType: "numeric",
      component: "input",
      error: errors.pincode?.message,
    },
    {
      control,
      name: "state",
      label: "State",
      placeholder: "Enter your State",
      component: "dropdown",
      className: "w-[90%] bg-base-200 rounded-lg",
      data:
        states?.map((state) => ({
          label: state.label,
          value: state.value,
        })) ?? [],
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
                  onResult={(locationData) => {
                    const formatted = locationData.formattedAddress ?? "";
                    const parts = formatted.split(",").map((p) => p.trim());

                    const lat = locationData.latitude;
                    const lng = locationData.longitude;
                    const pincode = locationData.postalCode || "";
                    const cityName = locationData.city || "";
                    const stateName = locationData.region || "";
                    const area = parts.length > 1 ? parts[2] : "";
                    const street_name = parts.length > 1 ? parts[1] : "";
                    const landmark = locationData.street || "";
                    const building_name = parts[0].match(/[A-Za-z]/)
                      ? parts[0]
                      : "";

                    const matchedState = formReferenceData?.getStates?.find(
                      (item) => item?.name === stateName.toLocaleUpperCase(),
                    );

                    setDetectedCityName(cityName);

                    setValue("latitude", String(lat));
                    setValue("longitude", String(lng));
                    setValue("pincode", pincode);
                    setValue("state", matchedState?.id ?? 0);
                    setValue(
                      "area",
                      building_name || area || street_name || landmark,
                    );
                  }}
                />
              )} */}
            </React.Fragment>
          ))}
        </View>

        <View className="flex-row justify-between w-[35%] self-center mt-6 mb-24">
          <PrimaryButton
            title="Next"
            onPress={handleSubmit(onSubmit, onError)}
            isLoading={isSubmitting}
          />
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}
