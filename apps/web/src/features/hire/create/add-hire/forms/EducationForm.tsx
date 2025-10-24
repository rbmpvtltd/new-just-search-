"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { educationSchema } from "@repo/db/src/schema/hire.schema";
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

type EducationSchema = z.infer<typeof educationSchema>;
export default function EducationForm() {
  const { page, prevPage, nextPage, setFormValue, formValue } =
    useHireFormStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EducationSchema>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      highestQualification: formValue.highestQualification ?? "",
      skillset: formValue.skillset ?? "",
      employmentStatus: formValue.employmentStatus ?? "",
      workExperienceYear: formValue.workExperienceYear ?? 0,
      workExperienceMonth: formValue.workExperienceMonth ?? undefined,
      previousJobRole: formValue.previousJobRole ?? "",
      jobRole: formValue.jobRole ?? "",
      certificates: formValue.certificates ?? "",
    },
  });

  const formFields: FormFieldProps<EducationSchema>[] = [
    {
      control,
      label: "Highest Qualification",
      name: "highestQualification",
      placeholder: "Highest Qualification",
      component: "select",
      options: [
        { label: "B.E / B.Tech", value: "b-e / b-tech" },
        { label: "M.E / M.Tech", value: "m-e / m-tech" },
        { label: "M.S Engineering", value: "m-s engineering" },
        { label: "M.Eng (Hons)", value: "m-eng (hons)" },
        { label: "B.Eng (Hons)", value: "b-eng (hons)" },
        { label: "Engineering Diploma", value: "engineering diploma" },
        { label: "AE", value: "ae" },
      ],
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
      ],
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
        { label: "fresher", value: "fresher" },
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
      type: "",
      label: "Certificates",
      name: "certificates",
      placeholder: "Certificates",
      component: "image",
      required: false,
      error: errors.certificates?.message,
    },
  ];
  const onSubmit = async (data: EducationSchema) => {
    const files = await uploadToCloudinary([data?.certificates], "hire");
    setFormValue("highestQualification", data.highestQualification ?? "");
    setFormValue("skillset", data.skillset ?? "");
    setFormValue("employmentStatus", data.employmentStatus ?? "");
    setFormValue("workExperienceYear", data.workExperienceYear ?? "");
    setFormValue("workExperienceMonth", data.workExperienceMonth ?? "");
    setFormValue("previousJobRole", data.previousJobRole ?? "");
    setFormValue("jobRole", data.jobRole ?? "");
    setFormValue("certificates", files[0] ?? "");
    nextPage();
  };
  return (
    <div className="min-h-screen p-4 relative">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl"
      >
        <div className="p-8 space-y-8">
          <div className="p-6 bg-white rounded-xl shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Qualifications and Experience
            </h2>
            {/* {
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formFields.map((field) => (
                  <FormField key={field.name} {...field} />
                ))}
              </div>
            } */}

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
            onClick={prevPage}
            className="bg-orange-500 hover:bg-orange-700 font-bold"
          >
            PREVIOUS
          </Button>

          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-700 font-bold "
          >
            {isSubmitting ? (
              <>
                <Spinner /> Loading...
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
