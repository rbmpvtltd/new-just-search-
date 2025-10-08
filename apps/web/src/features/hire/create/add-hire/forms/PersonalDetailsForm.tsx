"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { Button } from "@/components/ui/button";
import {
  GENDER,
  LANGUAGES,
  MARITAL_STATUS,
  SUB_CATEGORY,
} from "@/features/hire/shared/constants/hire";
import {
  type PersonalDetailsSchema,
  personalDetailsSchema,
} from "@/features/hire/shared/schemas/personal-details.schema";
import { useHireFormStore } from "@/features/hire/shared/store/useCreateHireStore";

export default function PersonalDetailsForm() {
  const { page, prevPage, nextPage, setFormValue, formValue } =
    useHireFormStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalDetailsSchema>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      // photo: formValue.photo ?? "",
      categoryId: formValue.categoryId ?? 0,
      // subcategory: formValue.subcategory ?? [],
      name: formValue.name ?? "",
      // gender: formValue.gender ?? undefined,
      // maritalStatus: formValue.maritalStatus ?? undefined,
      // fathersName: formValue.fathersName ?? "",
      // dateOfBirth: formValue.dateOfBirth ?? "",
      // languages: formValue.languages ?? [],
      // mobileNumber: formValue.mobileNumber ?? "",
      // alternateMobileNumber: formValue.alternateMobileNumber ?? "",
      // email: formValue.email ?? "",
      // latitude: formValue.latitude ?? "",
      // longitude: formValue.longitude ?? "",
      // address: formValue.address ?? "",
      // pincode: formValue.pincode ?? "",
      // state: formValue.state ?? "",
      // city: formValue.city ?? "",
    },
  });
  const formFields: FormFieldProps<PersonalDetailsSchema>[] = [
    // {
    //   control,
    //   type: "",
    //   label: "Profile Image",
    //   name: "photo",
    //   placeholder: "Upload your photo",
    //   component: "input",
    //   section: "profile",
    //   error: errors.photo?.message,
    // },
    {
      control,
      type: "text",
      label: "Applied For",
      name: "categoryId",
      placeholder: "Applied For",
      component: "select",
      section: "profile",
      options: [
        { value: 1, label: 1 },
        { value: 2, label: 2 },
        { value: 3, label: 3 },
      ],
      error: errors.categoryId?.message,
    },
    // {
    //   control,
    //   type: "text",
    //   label: "Sub Category",
    //   name: "subcategory",
    //   placeholder: "Select Sub Category",
    //   component: "multiselect",
    //   section: "profile",
    //   options: [...SUB_CATEGORY],
    //   error: errors.subcategory?.message,
    // },
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
    // {
    //   control,
    //   type: "text",
    //   label: "Gender",
    //   name: "gender",
    //   placeholder: "Select Gender",
    //   component: "select",
    //   section: "profile",
    //   options: [...GENDER],
    //   error: errors.gender?.message,
    // },
    // {
    //   control,
    //   type: "text",
    //   label: "Marital Status",
    //   name: "maritalStatus",
    //   placeholder: "Select Marital Status",
    //   component: "select",
    //   section: "profile",
    //   options: [...MARITAL_STATUS],
    //   error: errors.maritalStatus?.message,
    // },
    // {
    //   control,
    //   type: "text",
    //   label: "Father's Name",
    //   name: "fathersName",
    //   placeholder: "Father's Name",
    //   component: "input",
    //   section: "profile",
    //   error: errors.fathersName?.message,
    // },
    // {
    //   control,
    //   type: "date",
    //   label: "Date of Birth",
    //   name: "dateOfBirth",
    //   placeholder: "Date of Birth",
    //   component: "input",
    //   section: "profile",
    //   error: errors.dateOfBirth?.message,
    // },
    // {
    //   control,
    //   type: "text",
    //   label: "Languages",
    //   name: "languages",
    //   placeholder: "Select Languages",
    //   component: "multiselect",
    //   section: "profile",
    //   options: [...LANGUAGES],
    //   error: errors.languages?.message,
    // },
    // {
    //   control,
    //   type: "tel",
    //   label: "Mobile Number",
    //   name: "mobileNumber",
    //   placeholder: "Mobile Number",
    //   component: "input",
    //   section: "profile",
    //   error: errors.mobileNumber?.message,
    // },
    // {
    //   control,
    //   type: "tel",
    //   label: "Alternate Mobile Number",
    //   name: "alternateMobileNumber",
    //   placeholder: "Alternate Mobile Number",
    //   component: "input",
    //   required: false,
    //   section: "profile",
    //   error: errors.alternateMobileNumber?.message,
    // },
    // {
    //   control,
    //   type: "email",
    //   label: "Email",
    //   name: "email",
    //   placeholder: "Email Address",
    //   component: "input",
    //   required: false,
    //   section: "profile",
    //   error: errors.email?.message,
    // },
    // {
    //   control,
    //   type: "text",
    //   label: "Latitude",
    //   name: "latitude",
    //   placeholder: "Latitude",
    //   section: "loction",
    //   component: "input",
    //   error: errors.latitude?.message,
    // },
    // {
    //   control,
    //   type: "text",
    //   label: "Longitude",
    //   name: "longitude",
    //   placeholder: "Longitude",
    //   component: "input",
    //   section: "loction",
    //   error: errors.longitude?.message,
    // },
    // {
    //   control,
    //   type: "text",
    //   label: "Address",
    //   name: "address",
    //   placeholder: "Address",
    //   component: "input",
    //   section: "loction",
    //   error: errors.address?.message,
    // },
    // {
    //   control,
    //   type: "text",
    //   label: "Pincode",
    //   name: "pincode",
    //   placeholder: "Pincode",
    //   component: "input",
    //   section: "loction",
    //   error: errors.pincode?.message,
    // },
    // {
    //   control,
    //   type: "text",
    //   label: "State",
    //   name: "state",
    //   placeholder: "Select State",
    //   component: "select",
    //   section: "loction",
    //   options: [
    //     { value: "Job", label: "Job" },
    //     { value: "Internship", label: "Internship" },
    //     { value: "Other", label: "Other" },
    //   ],
    //   error: errors.state?.message,
    // },
    // {
    //   control,
    //   type: "text",
    //   label: "City",
    //   name: "city",
    //   placeholder: "Select City",
    //   component: "select",
    //   section: "loction",
    //   options: [
    //     { value: "Job", label: "Job" },
    //     { value: "Internship", label: "Internship" },
    //     { value: "Other", label: "Other" },
    //   ],
    //   error: errors.city?.message,
    // },
  ];

  const onSubmit = (data: PersonalDetailsSchema) => {
    console.log(data, "data");

    // setFormValue("photo", data.photo ?? "");
    setFormValue("appliedFor", data.appliedFor ?? "");
    // setFormValue("subcategory", data.subcategory ?? "");
    setFormValue("name", data.name ?? "");
    // setFormValue("gender", data.gender ?? "");
    // setFormValue("maritalStatus", data.maritalStatus ?? "");
    // setFormValue("fatherName", data.fathersName ?? "");
    // setFormValue("dateOfBirth", data.dateOfBirth ?? "");
    // setFormValue("languages", data.languages ?? "");
    // setFormValue("mobileNumber", data.mobileNumber ?? "");
    // setFormValue("alternateMobileNumber", data.alternateMobileNumber ?? "");
    // setFormValue("email", data.email ?? "");
    // setFormValue("latitude", data.latitude ?? "");
    // setFormValue("longitude", data.longitude ?? "");
    // setFormValue("address", data.address ?? "");
    // setFormValue("pincode", data.pincode ?? "");
    // setFormValue("state", data.state ?? "");
    // setFormValue("city", data.city ?? "");
    console.log(data, "data");
    console.log("form value", formValue);
    nextPage();
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8 ">
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

              {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formFields
                  .filter((fields) => fields.section === "loction")
                  .map((field, index) => (
                    <div
                      key={field.name}
                      className={
                        field.name === "address"
                          ? "md:col-span-2 lg:col-span-3"
                          : ""
                      }
                    >
                      <FormField {...field} />
                    </div>
                  ))}
              </div> */}
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <Button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-md">
            CONTINUE
          </Button>
        </div>
      </form>
    </div>
  );
}
