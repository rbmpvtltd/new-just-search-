"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { educationSchema } from "@repo/db/dist/schema/hire.schema";
import { useForm } from "react-hook-form";
import type z from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { uploadToCloudinary } from "@/components/image/cloudinary";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useHireFormStore } from "@/features/hire/shared/store/useCreateHireStore";
import type { UserHireListingType } from "..";

type EducationSchema = z.infer<typeof educationSchema>;
export default function EducationForm({
  hireListing,
}: {
  hireListing: UserHireListingType;
}) {
  const setFormValue = useHireFormStore((state) => state.setFormValue);
  const nextPage = useHireFormStore((state) => state.nextPage);
  const formValue = useHireFormStore((state) => state.formValue);
  const prevPage = useHireFormStore((state) => state.prevPage);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EducationSchema>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      highestQualification:
        formValue.highestQualification === 0
          ? hireListing?.hire?.highestQualification
          : (formValue.highestQualification ?? NaN),
      skillset:
        formValue.skillset === ""
          ? hireListing?.hire?.skillset
          : (formValue.skillset ?? ""),
      employmentStatus:
        formValue.employmentStatus === ""
          ? hireListing?.hire?.employmentStatus
          : (formValue.employmentStatus ?? ""),
      workExperienceYear:
        formValue.workExperienceYear === null
          ? hireListing?.hire?.workExperienceYear
          : (formValue.workExperienceYear ?? null),
      workExperienceMonth:
        formValue.workExperienceMonth === null
          ? hireListing?.hire?.workExperienceMonth
          : (formValue.workExperienceMonth ?? null),
      jobRole:
        formValue.jobRole === ""
          ? hireListing?.hire?.jobRole
          : (formValue.jobRole ?? ""),
      previousJobRole: formValue.previousJobRole
        ? hireListing?.hire?.previousJobRole
        : (formValue.previousJobRole ?? ""),
      certificates:
        formValue.certificates === ""
          ? hireListing?.hire?.certificates
          : (formValue.certificates ?? ""),
    },
  });

  const formFields: FormFieldProps<EducationSchema>[] = [
    {
      control,
      label: "Highest Qualification",
      name: "highestQualification",
      placeholder: "Highest Qualification",
      component: "select",
      options: hireListing?.getHighestQualification?.map((item) => ({
        label: item.name,
        value: item.id,
      })),
      error: errors.highestQualification?.message,
    },
    {
      control,
      label: "Skill Set",
      name: "skillset",
      placeholder: "Skill Set",
      component: "input",
      required: false,
      error: errors.skillset?.message,
    },
    {
      control,
      label: "Currently Employed",
      name: "employmentStatus",
      placeholder: "Currently Employed",
      component: "select",
      options: [
        {
          label: "Yes",
          value: "yes",
        },
        {
          label: "No",
          value: "no",
        },
      ],
      error: errors.employmentStatus?.message,
    },
    {
      control,
      label: "Work Experience (Years)",
      name: "workExperienceYear",
      placeholder: "Years",
      component: "select",
      options: [
        { label: "0", value: 0 },
        { label: "1", value: 1 },
        { label: "2", value: 2 },
        { label: "3", value: 3 },
        { label: "4", value: 4 },
        { label: "5", value: 5 },
        { label: "6", value: 6 },
        { label: "7", value: 7 },
        { label: "8", value: 8 },
        { label: "9", value: 9 },
        { label: "10", value: 10 },
        { label: "11", value: 11 },
        { label: "12", value: 12 },
        { label: "13", value: 13 },
        { label: "14", value: 14 },
        { label: "15", value: 15 },
      ],
      required: false,
      error: errors.workExperienceYear?.message,
    },
    {
      control,
      label: "Months",
      name: "workExperienceMonth",
      placeholder: "Months",
      component: "select",
      required: false,
      options: [
        { label: "0", value: 0 },
        { label: "1", value: 1 },
        { label: "2", value: 2 },
        { label: "3", value: 3 },
        { label: "4", value: 4 },
        { label: "5", value: 5 },
        { label: "6", value: 6 },
        { label: "7", value: 7 },
        { label: "8", value: 8 },
        { label: "9", value: 9 },
        { label: "10", value: 10 },
        { label: "11", value: 11 },
        { label: "12", value: 12 },
      ],
      error: errors.workExperienceMonth?.message,
    },
    {
      control,
      label: "Job Role",
      name: "jobRole",
      placeholder: "Job Role",
      component: "input",
      error: errors.jobRole?.message,
    },
    {
      control,
      label: "Previous Job Role",
      name: "previousJobRole",
      placeholder: "Previous Job Role",
      component: "input",
      required: false,
      error: errors.previousJobRole?.message,
    },
    {
      control,
      label: "Certificate",
      name: "certificates",
      placeholder: "Certificate",
      component: "image",
      required: false,
      error: errors.certificates?.message,
    },
  ];

  const onSubmit = async (data: EducationSchema) => {
    const files = await uploadToCloudinary([data?.certificates], "hire");
    useHireFormStore.setState((state) => ({
      formValue: { ...state.formValue, ...data, certificates: files[0] ?? "" },
    }));
    nextPage();
  };
  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl">
        <div className="p-8 space-y-8">
          <div className="p-6 bg-gray-50 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Qualifications and Experience
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formFields.map((field) => {
                if (field.name === "workExperienceYear") {
                  const monthsField = formFields.find(
                    (f) => f.name === "workExperienceMonth",
                  );

                  return (
                    <div
                      key={field.name}
                      className="col-span-1 md:col-span-2 lg:col-span-2"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <FormField {...field} />
                        {monthsField && <FormField {...monthsField} />}
                      </div>
                    </div>
                  );
                }

                if (field.name === "workExperienceMonth") return null;

                return <FormField key={field.name} {...field} />;
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200 gap-4">
          <Button
            type="submit"
            onClick={prevPage}
            className="bg-orange-500 hover:bg-orange-700  font-bold"
          >
            PREVIOUS
          </Button>
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
