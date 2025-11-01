"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Gender,
  MaritalStatus,
  personalDetailsHireSchema,
} from "@repo/db/src/schema/hire.schema";
import { useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import type z from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { uploadToCloudinary } from "@/components/image/cloudinary";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useHireFormStore } from "@/features/hire/shared/store/useCreateHireStore";
import { useTRPC } from "@/trpc/client";
import type { FormReferenceDataType, UserHireListingType } from "..";

type PersonalDetailsSchema = z.infer<typeof personalDetailsHireSchema>;

export default function PersonalDetailsForm({
  hireListing,
  formReferenceData,
}: {
  hireListing: UserHireListingType;
  formReferenceData: FormReferenceDataType;
}) {
  const trpc = useTRPC();
  const setFormValue = useHireFormStore((state) => state.setFormValue);
  const nextPage = useHireFormStore((state) => state.nextPage);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PersonalDetailsSchema>({
    resolver: zodResolver(personalDetailsHireSchema),
    defaultValues: {
      photo: hireListing?.photo ?? "",
      name: hireListing?.name ?? "",
      categoryId: hireListing?.categoryId.id,
      subcategoryId: hireListing?.subcategoryId.map((item) => item.id) ?? [],
      gender: hireListing?.gender ?? undefined,
      maritalStatus: hireListing?.maritalStatus ?? undefined,
      fatherName: hireListing?.fatherName ?? "",
      dob: hireListing?.dob ?? "",
      languages: hireListing?.languages ?? [],
      mobileNumber: hireListing?.mobileNumber ?? "",
      alternativeMobileNumber: hireListing?.alternativeMobileNumber ?? "",
      email: hireListing?.email ?? "",
      latitude: hireListing?.latitude ?? "",
      longitude: hireListing?.longitude ?? "",
      area: hireListing?.area ?? "",
      pincode: hireListing?.pincode ?? "",
      state: hireListing?.state.id ?? undefined,
      city: hireListing?.city.id ?? undefined,
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

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (cityLoading) {
    return <div>Loading...</div>;
  }
  const formFields: FormFieldProps<PersonalDetailsSchema>[] = [
    {
      control,
      label: "Profile Image",
      name: "photo",
      placeholder: "Upload your photo",
      component: "image",
      section: "profile",
      error: "",
    },
    {
      control,
      type: "text",
      label: "Applied For",
      name: "categoryId",
      placeholder: "Applied For",
      component: "select",
      section: "profile",
      disabled: true,
      options: categories?.map((item) => ({
        label: item.label,
        value: Number(item.value),
      })),
      error: "",
    },
    {
      control,
      type: "text",
      label: "Sub Category",
      name: "subcategoryId",
      placeholder: "Select Sub Category",
      component: "multiselect",
      section: "profile",
      options: subCategories?.map((item) => ({
        label: item.name,
        value: Number(item.id),
      })),
      error: "",
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
      error: "",
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
      error: "",
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
      error: "",
    },
    {
      control,
      type: "text",
      label: "Father's Name",
      name: "fatherName",
      placeholder: "Father's Name",
      component: "input",
      section: "profile",
      error: "",
    },
    {
      control,
      type: "date",
      label: "Date of Birth",
      name: "dob",
      placeholder: "Date of Birth",
      component: "input",
      section: "profile",
      error: "",
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
        { value: "English", label: "English" },
        { value: "Hindi", label: "Hindi" },
        { value: "Telugu", label: "Telugu" },
        { value: "Punjabi", label: "Punjabi" },
      ],
      error: "",
    },
    {
      control,
      type: "tel",
      label: "Mobile Number",
      name: "mobileNumber",
      placeholder: "Mobile Number",
      component: "input",
      section: "profile",
      error: "",
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
      error: "",
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
      error: "",
    },
    {
      control,
      type: "text",
      label: "Latitude",
      name: "latitude",
      placeholder: "Latitude",
      section: "loction",
      component: "input",
      error: "",
    },
    {
      control,
      type: "text",
      label: "Longitude",
      name: "longitude",
      placeholder: "Longitude",
      component: "input",
      section: "loction",
      error: "",
    },
    {
      control,
      type: "text",
      label: "Address",
      name: "area",
      placeholder: "Address",
      component: "input",
      section: "loction",
      error: "",
    },
    {
      control,
      type: "text",
      label: "Pincode",
      name: "pincode",
      placeholder: "Pincode",
      component: "input",
      section: "loction",
      error: "",
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
        states?.map((state) => ({ label: state.label, value: state.value })) ??
        [],
      error: "",
    },
    {
      control,
      type: "text",
      label: "City",
      name: "city",
      placeholder: "Select City",
      component: "select",
      section: "loction",
      options:
        cities?.map((city) => ({ label: city.city, value: city.id })) ?? [],
      error: "",
    },
  ];

  const onSubmit = async (data: PersonalDetailsSchema) => {
    const files = await uploadToCloudinary([data.photo], "hire");
    setFormValue("photo", files[0] ?? "");
    setFormValue("name", data.name ?? "");
    setFormValue("categoryId", data.categoryId ?? "");
    setFormValue("subcategoryId", data.subcategoryId ?? []);
    setFormValue("gender", data.gender ?? []);
    setFormValue("fatherName", data.fatherName ?? "");
    setFormValue("maritalStatus", data.maritalStatus ?? "");
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
    <div className="bg-gray-100 min-h-screen p-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl"
      >
        <div className="p-8 space-y-8">
          <div className="p-6 bg-white rounded-xl shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Profile Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formFields
                .filter((fields) => fields.section === "profile")
                .map((field, index) => (
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

                <Button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow"
                >
                  Auto Detect Location
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formFields
                  .filter((fields) => fields.section === "loction")
                  .map((field, index) => (
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
