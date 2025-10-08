"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { Button } from "@/components/ui/button";
import {
  EXPERIENCE_MONTHS,
  EXPERIENCE_YEARS,
  QUALIFICATIONS,
  YES_NO_OPTIONS,
} from "@/features/hire/shared/constants/hire";
import {
  type EducationSchema,
  educationSchema,
} from "@/features/hire/shared/schemas/education.schema";
import { useHireFormStore } from "@/features/hire/shared/store/useCreateHireStore";

export default function EducationForm() {
  const { page, prevPage, nextPage, setFormValue, formValue } =
    useHireFormStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EducationSchema>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      // highestQualification: formValue.highestQualification ?? "",
      skillset: formValue.skillset ?? "",
      // currentlyEmployed: formValue.currentlyEmployed ?? "",
      // workExperienceYears: formValue.workExperienceYears ?? "",
      // workExperienceMonths: formValue.workExperienceMonths ?? undefined,
      // previousJobRole: formValue.previousJobRole ?? "",
      // jobRole: formValue.jobRole ?? "",
      // certificate: formValue.certificate ?? "",
    },
  });
  const onSubmit = (data: EducationSchema) => {
    // setFormValue("highestQualification", data.highestQualification ?? "");
    setFormValue("skillset", data.skillset ?? "");
    // setFormValue("currentlyEmployed", data.currentlyEmployed ?? "");
    // setFormValue("workExperienceYears", data.workExperienceYears ?? "");
    // setFormValue("workExperienceMonths", data.workExperienceMonths ?? "");
    // setFormValue("previousJobRole", data.previousJobRole ?? "");
    // setFormValue("jobRole", data.jobRole ?? "");
    // setFormValue("certificate", data.certificate ?? "");
    // console.log("form value", formValue ?? "");
    console.log("data", data);

    nextPage();
  };
  const formFields: FormFieldProps<EducationSchema>[] = [
    // {
    //   control,
    //   label: "Highest Qualification",
    //   name: "highestQualification",
    //   placeholder: "Highest Qualification",
    //   component: "select",
    //   options: [...QUALIFICATIONS],
    //   error: errors.highestQualification?.message,
    // },
    {
      control,
      label: "Skill Set",
      name: "skillset",
      placeholder: "Skill Set",
      component: "input",
      required: false,
      error: errors.skillset?.message,
    },
    // {
    //   control,
    //   label: "Currently Employed",
    //   name: "currentlyEmployed",
    //   placeholder: "Currently Employed",
    //   component: "select",
    //   options: [...YES_NO_OPTIONS],
    //   error: errors.currentlyEmployed?.message,
    // },
    // {
    //   control,
    //   label: "Work Experience (Years)",
    //   name: "workExperienceYears",
    //   placeholder: "Years",
    //   component: "select",
    //   options: [...EXPERIENCE_YEARS],
    //   error: errors.workExperienceYears?.message,
    // },
    // {
    //   control,
    //   label: "Months",
    //   name: "workExperienceMonths",
    //   placeholder: "Months",
    //   component: "select",
    //   required: false,
    //   options: [...EXPERIENCE_MONTHS],
    //   error: errors.workExperienceMonths?.message,
    // },
    // {
    //   control,
    //   label: "Job Role",
    //   name: "jobRole",
    //   placeholder: "Job Role",
    //   component: "input",
    //   error: errors.jobRole?.message,
    // },
    // {
    //   control,
    //   label: "Previous Job Role",
    //   name: "previousJobRole",
    //   placeholder: "Previous Job Role",
    //   component: "input",
    //   required: false,
    //   error: errors.previousJobRole?.message,
    // },
    // {
    //   control,
    //   type: "",
    //   label: "Certificate",
    //   name: "certificate",
    //   placeholder: "Certificate",
    //   component: "input",
    //   required: false,
    //   error: errors.certificate?.message,
    // },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-8">
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
                if (field.name === "workExperienceYears") {
                  const monthsField = formFields.find(
                    (f) => f.name === "workExperienceMonths",
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

                if (field.name === "workExperienceMonths") return null;

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
            CONTINUE
          </Button>
        </div>
      </form>
    </div>
  );
}
