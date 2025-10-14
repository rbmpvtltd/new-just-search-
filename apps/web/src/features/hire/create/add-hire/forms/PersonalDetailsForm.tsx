"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Gender,
  JobType,
  MaritalStatus,
  personalDetailsHireSchema,
} from "@repo/db/src/schema/hire.schema";
import { useForm } from "react-hook-form";
import type z from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { Button } from "@/components/ui/button";
// import {
//   personalDetailsSchema,
// } from "@/features/hire/shared/schemas/personal-details.schema";
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
  const { page, prevPage, nextPage, setFormValue, formValue } =
    useHireFormStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalDetailsSchema>({
    resolver: zodResolver(personalDetailsHireSchema),
    defaultValues: {
      name: "hi",
      jobType: [],
      // photo: formValue.photo ?? "",
      // categoryId: formValue.categoryId ?? "",
      // subcategoryId: formValue.subcategoryId ?? [],
      // name: formValue.name ?? "",
      gender: formValue.gender ?? "Male",
      maritalStatus: formValue.maritalStatus ?? "Others",
      // fatherName: formValue.fatherName ?? "",
      // dob: formValue.dob ?? "",
      // languages: formValue.languages ?? [],
      // mobileNumber: formValue.mobileNumber ?? "",
      // alternateMobileNumber: formValue.alternateMobileNumber ?? "",
      // email: formValue.email ?? "",
      // latitude: formValue.latitude ?? "",
      // longitude: formValue.longitude ?? "",
      // area: formValue.area ?? "",
      // pincode: formValue.pincode ?? "",
      // state: formValue.state ?? "",
      // city: formValue.city ?? "",
    },
  });

  // const categories = data?.getHireCategories.map((item: any) => {
  //   return {
  //     label: item.title,
  //     value: item.id,
  //   };
  // });
  // const selectedCategoryId = useWatch({ control, name: "categoryId" });

  // console.log("selectedCategoryId", selectedCategoryId);

  // const { data: subCategories, isLoading } = useQuery(
  //   trpc.hirerouter.getSubCategories.queryOptions({
  //     categoryId: selectedCategoryId,
  //   }),
  // );
  // console.log("subCategories", subCategories);

  // const states = data?.getStates.map((item: any) => {
  //   return {
  //     label: item.name,
  //     value: item.id,
  //   };
  // });
  // const selectedStateId = useWatch({ control, name: "state" });
  // console.log("selectedStateId", selectedStateId);

  // const { data: cities, isLoading: cityLoading } = useQuery(
  //   trpc.hirerouter.getCities.queryOptions({
  //     state: selectedStateId,
  //   }),
  // );

  // console.log("cities", cities);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }
  // if (cityLoading) {
  //   return <div>Loading...</div>;
  // }

  // const citiesList = cities?.map((item) => {
  //   return {
  //     label: item.city,
  //     value: item.id,
  //   };
  // });
  // const subCategoriesList = subCategories?.map((item) => {
  //   return {
  //     label: item.name,
  //     value: item.id,
  //   };
  // });

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
    // {
    //   control,
    //   type: "text",
    //   label: "Applied For",
    //   name: "categoryId",
    //   placeholder: "Applied For",
    //   component: "select",
    //   section: "profile",
    //   options: [
    //     { label: "Teacher", value: 1 },
    //     { label: "All Subjects", value: 2 },
    //   ],
    //   error: errors.categoryId?.message,
    // },
    // {
    //   control,
    //   type: "text",
    //   label: "Sub Category",
    //   name: "subcategoryId",
    //   placeholder: "Select Sub Category",
    //   component: "multiselect",
    //   section: "profile",
    //   options: [
    //     { label: "Teacher", value: 1 },
    //     { label: "All Subjects", value: 2 },
    //   ],
    //   error: errors.subcategoryId?.message,
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
      label: "job type",
      name: "jobType",
      placeholder: "Select Marital Status",
      component: "checkbox",
      section: "profile",
      options: Object.values(JobType).map((item) => {
        return {
          label: item,
          value: item,
        };
      }),
      error: errors.maritalStatus?.message,
    },
    // {
    //   control,
    //   type: "text",
    //   label: "Father's Name",
    //   name: "fatherName",
    //   placeholder: "Father's Name",
    //   component: "input",
    //   section: "profile",
    //   error: errors.fatherName?.message,
    // },
    // {
    //   control,
    //   type: "date",
    //   label: "Date of Birth",
    //   name: "dob",
    //   placeholder: "Date of Birth",
    //   component: "input",
    //   section: "profile",
    //   error: errors.dob?.message,
    // },
    // {
    //   control,
    //   type: "text",
    //   label: "Languages",
    //   name: "languages",
    //   placeholder: "Select Languages",
    //   component: "multiselect",
    //   section: "profile",
    //   options: [
    //     {
    //       label: "Hindi",
    //       value: "Hindi",
    //     },
    //   ],
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
    //   placeholder: "Email area",
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
    //   label: "area",
    //   name: "area",
    //   placeholder: "area",
    //   component: "input",
    //   section: "loction",
    //   error: errors.area?.message,
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
    //     { label: "Rajasthan", value: 1 },
    //     { label: "Uttar Pradesh", value: 2 },
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
    //     { label: "Jaipur", value: 2 },
    //     { label: "Jodhpur", value: 1 },
    //   ],
    //   error: errors.city?.message,
    // },
  ];

  const onSubmit = (data: PersonalDetailsSchema) => {
    console.log("data", data);

    // setFormValue("photo", data.photo ?? "");
    // setFormValue("categoryId", data.categoryId ?? "");
    // setFormValue("subcategoryId", data.subcategoryId?.map(String) ?? []);
    // setFormValue("name", data.name ?? "");
    // setFormValue("gender", data.gender ?? []);
    // setFormValue("maritalStatus", data.maritalStatus ?? "");
    // setFormValue("fatherName", data.fatherName ?? "");
    // setFormValue("dob", data.dob ?? "");
    // setFormValue("languages", data.languages ?? []);
    // setFormValue("mobileNumber", data.mobileNumber ?? "");
    // setFormValue("alternateMobileNumber", data.alternateMobileNumber ?? "");
    // setFormValue("email", data.email ?? "");
    // setFormValue("latitude", data.latitude ?? "");
    // setFormValue("longitude", data.longitude ?? "");
    // setFormValue("area", data.area ?? "");
    // setFormValue("pincode", data.pincode ?? "");
    // setFormValue("state", data.state ?? "");
    // setFormValue("city", data.city ?? "");
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

              {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> */}
              {/*   {formFields */}
              {/*     .filter((fields) => fields.section === "loction") */}
              {/*     .map((field, index) => ( */}
              {/*       <div */}
              {/*         key={field.name} */}
              {/*         className={ */}
              {/*           field.name === "area" */}
              {/*             ? "md:col-span-2 lg:col-span-3" */}
              {/*             : "" */}
              {/*         } */}
              {/*       > */}
              {/*         <FormField {...field} /> */}
              {/*       </div> */}
              {/*     ))} */}
              {/* </div> */}
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-700 font-bold "
          >
            CONTINUE
          </Button>
        </div>
      </form>
    </div>
  );
}
