"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Gender, MaritalStatus } from "@repo/db/dist/enum/allEnum.enum";
import { personalDetailsHireSchema } from "@repo/db/dist/schema/hire.schema";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import type z from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { uploadToCloudinary } from "@/components/image/cloudinary";
import LocationAutoDetect from "@/components/LocationAutoDetect";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useHireFormStore } from "@/features/hire/shared/store/useCreateHireStore";
import { useTRPC } from "@/trpc/client";
import type { AddHirePageType } from "..";

type PersonalDetailsSchema = z.infer<typeof personalDetailsHireSchema>;

export default function PersonalDetailsForm({
  data,
}: {
  data: AddHirePageType;
}) {
  const trpc = useTRPC();
  const nextPage = useHireFormStore((s) => s.nextPage);
  const formValue = useHireFormStore((s) => s.formValue);
  const setFormValue = useHireFormStore((s) => s.setFormValue);
  const [detectedCityName, setDetectedCityName] = React.useState<null | string>(
    null,
  );
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PersonalDetailsSchema>({
    resolver: zodResolver(personalDetailsHireSchema),
    defaultValues: {
      name: formValue.name ?? "",
      photo: formValue.photo ?? "",
      categoryId: formValue.categoryId ?? "",
      subcategoryId: formValue.subcategoryId ?? [],
      gender: formValue.gender ?? "",
      maritalStatus: formValue.maritalStatus ?? "Others",
      fatherName: formValue.fatherName ?? "",
      dob: formValue.dob ?? "",
      languages: formValue.languages ?? [],
      mobileNumber: formValue.mobileNumber ?? "",
      alternativeMobileNumber: formValue.alternativeMobileNumber ?? "",
      email: formValue.email ?? "",
      latitude: formValue.latitude ?? "",
      longitude: formValue.longitude ?? "",
      area: formValue.area ?? "",
      pincode: formValue.pincode ?? "",
      state: formValue.state ?? 0,
      city: formValue.city ?? 0,
    },
  });

  const categories = data?.getHireCategories.map((item) => {
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

  const states = data?.getStates.map((item) => {
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

  if (cities && cities.length > 0 && detectedCityName) {
    const matchedCity = cities?.find(
      (city) => city.city.toLowerCase() === detectedCityName?.toLowerCase(),
    );
    if (matchedCity && matchedCity?.id !== control._formValues.city) {
      setValue("city", matchedCity?.id, {
        shouldValidate: true,
      });
    }
  }
  const formFields: FormFieldProps<PersonalDetailsSchema>[] = [
    {
      control,
      type: "",
      label: "Profile Image",
      name: "photo",
      placeholder: "Upload your photo",
      component: "image",
      section: "profile",
      error: errors.photo?.message,
    },
    {
      control,
      type: "text",
      label: "Applied For",
      name: "categoryId",
      placeholder: "Applied For",
      component: "select",
      section: "profile",
      options:
        categories?.map((item) => ({
          label: item.label,
          value: Number(item.value),
        })) ?? [],
      error: errors.categoryId?.message,
    },
    {
      control,
      type: "text",
      label: "Sub Category",
      name: "subcategoryId",
      placeholder: "Select Sub Category",
      component: "multiselect",
      loading: isLoading,
      section: "profile",
      options: subCategories?.map((item) => ({
        label: item.name,
        value: Number(item.id),
      })),
      error: errors.subcategoryId?.message,
    },
    {
      control,
      type: "text",
      label: "Full Name",
      name: "name",
      placeholder: "Full Name",
      component: "input",
      className: "",
      section: "profile",
      error: errors.name?.message,
    },
    {
      control,
      type: "text",
      label: "Gender",
      name: "gender",
      placeholder: "Select Gender",
      component: "select",
      section: "profile",
      options: Object.values(Gender).map((item) => ({
        label: item,
        value: item,
      })),
      error: errors.gender?.message,
    },
    {
      control,
      type: "text",
      label: "Marital Status",
      name: "maritalStatus",
      placeholder: "Select Marital Status",
      component: "select",
      section: "profile",
      options: Object.values(MaritalStatus).map((item) => {
        return {
          label: item,
          value: item,
        };
      }),
      error: errors.maritalStatus?.message,
    },

    {
      control,
      type: "text",
      label: "Father's Name",
      name: "fatherName",
      placeholder: "Father's Name",
      component: "input",
      section: "profile",
      error: errors.fatherName?.message,
    },
    {
      control,
      type: "date",
      label: "Date of Birth",
      name: "dob",
      placeholder: "Date of Birth",
      component: "input",
      section: "profile",
      error: errors.dob?.message,
    },
    {
      control,
      type: "text",
      label: "Languages",
      name: "languages",
      placeholder: "Select Languages",
      component: "multiselect",
      section: "profile",
      options: [
        { label: "Hindi", value: "Hindi" },
        { label: "English", value: "English" },
        { label: "Punjabi", value: "Punjabi" },
        { label: "Gujarati", value: "Gujarati" },
        { label: "Bengali", value: "Bengali" },
        { label: "Malayalam", value: "Malayalam" },
        { label: "Kannada", value: "Kannada" },
        { label: "Tamil", value: "Tamil" },
        { label: "Other", value: "Other" },
      ],
      error: errors.languages?.message,
    },
    {
      control,
      type: "tel",
      label: "Mobile Number",
      name: "mobileNumber",
      placeholder: "Mobile Number",
      component: "input",
      section: "profile",
      error: errors.mobileNumber?.message,
    },
    {
      control,
      type: "tel",
      label: "Alternate Mobile Number",
      name: "alternativeMobileNumber",
      placeholder: "Alternate Mobile Number",
      component: "input",
      required: false,
      section: "profile",
      error: errors.alternativeMobileNumber?.message,
    },
    {
      control,
      type: "email",
      label: "Email",
      name: "email",
      placeholder: "Email Address",
      component: "input",
      required: false,
      section: "profile",
      error: errors.email?.message,
    },
    {
      control,
      type: "text",
      label: "Latitude",
      name: "latitude",
      placeholder: "Latitude",
      section: "loction",
      component: "input",
      error: errors.latitude?.message,
    },
    {
      control,
      type: "text",
      label: "Longitude",
      name: "longitude",
      placeholder: "Longitude",
      component: "input",
      section: "loction",
      error: errors.longitude?.message,
    },
    {
      control,
      type: "text",
      label: "area",
      name: "area",
      placeholder: "area",
      component: "input",
      section: "loction",
      error: errors.area?.message,
    },
    {
      control,
      type: "text",
      label: "Pincode",
      name: "pincode",
      placeholder: "Pincode",
      component: "input",
      section: "loction",
      error: errors.pincode?.message,
    },
    {
      control,
      type: "text",
      label: "State",
      name: "state",
      placeholder: "Select State",
      component: "select",
      section: "loction",
      options:
        states?.map((state) => ({
          label: state.label,
          value: state.value,
        })) ?? [],
      error: errors.state?.message,
    },
    {
      control,
      type: "text",
      label: "City",
      name: "city",
      placeholder: "Select City",
      component: "select",
      section: "loction",
      loading: cityLoading,
      options:
        cities?.map((city) => ({ label: city.city, value: city.id })) ?? [],
      error: errors.city?.message,
    },
  ];

  const onSubmit = async (data: PersonalDetailsSchema) => {
    const files = await uploadToCloudinary([data.photo], "hire");
    setFormValue("photo", files[0] ?? "");
    setFormValue("categoryId", data.categoryId ?? "");
    setFormValue("subcategoryId", data.subcategoryId ?? []);
    setFormValue("name", data.name ?? "");
    setFormValue("gender", data.gender ?? []);
    setFormValue("maritalStatus", data.maritalStatus ?? "");
    setFormValue("fatherName", data.fatherName ?? "");
    setFormValue("dob", data.dob ?? "");
    setFormValue("languages", data.languages ?? []);
    setFormValue("mobileNumber", data.mobileNumber ?? "");
    setFormValue("alternativeMobileNumber", data.alternativeMobileNumber ?? "");
    setFormValue("email", data.email ?? "");
    setFormValue("latitude", data.latitude ?? "");
    setFormValue("longitude", data.longitude ?? "");
    setFormValue("area", data.area ?? "");
    setFormValue("pincode", data.pincode ?? "");
    setFormValue("state", data.state ?? "");
    setFormValue("city", data.city ?? "");
    nextPage();
  };

  return (
    <div className="min-h-screen p-4 ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-6xl mx-auto bg-gray-100 rounded-lg shadow-xl"
      >
        <div className="p-8 space-y-8">
          <div className="p-6 bg-white rounded-xl shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Profile Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formFields
                .filter((fields) => fields.section === "profile")
                .map((field) => (
                  <FormField key={field.name} {...field} />
                ))}
            </div>

            <div className="md:col-span-2 lg:col-span-3 mt-10">
              <p className="mt-3 text-sm text-gray-500 italic mb-4">
                Your latitude and longitude will only be used to improve
                location-based services and will remain confidential. This
                information will not be shared publicly.
              </p>
              <div className="flex items-end justify-between mb-4">
                <h3 className="text-md font-medium text-gray-700">
                  Location Details
                </h3>

                <div className="flex items-end justify-between mb-4 ">
                  <LocationAutoDetect
                    onResult={(data) => {
                      const formatted = data.formattedAddress ?? "";
                      const parts = formatted
                        .split(",")
                        .map((part) => part.trim());
                      const lat = data.latitude;
                      const long = data.longitude;
                      const pincode = data.postalCode || "";
                      const cityName = data.city || "";
                      const stateName = data.region || "";
                      const area = parts[0]?.match(/[A-Za-z]/)
                        ? parts[0]
                        : formatted;
                      const matchedState = states?.find(
                        (state) =>
                          state.label === stateName.toLocaleUpperCase(),
                      );
                      setDetectedCityName(cityName);

                      setValue("latitude", String(lat));
                      setValue("longitude", String(long));
                      setValue("area", area);
                      setValue("pincode", pincode);
                      setValue("state", matchedState?.value ?? 0);
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formFields
                  .filter((fields) => fields.section === "loction")
                  .map((field, _) => (
                    <div
                      key={field.name}
                      className={
                        field.name === "area"
                          ? "md:col-span-2 lg:col-span-3"
                          : ""
                      }
                    >
                      <FormField {...field} />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-md min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Spinner />
                Loading...
              </>
            ) : (
              "CONTINUE"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
