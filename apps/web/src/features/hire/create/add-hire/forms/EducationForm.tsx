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

type EducationSchema = z.infer<typeof educationSchema>;
export default function EducationForm() {
  const nextPage = useHireFormStore((state) => state.nextPage);
  const prevPage = useHireFormStore((state) => state.prevPage);
  const formValue = useHireFormStore((state) => state.formValue);

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
        { label: "AET", value: "aet" },
        { label: "B.Plan", value: "b-plan" },
        { label: "B.Arch", value: "b-arch" },
        { label: "B.Tech L.L.B.", value: "b-tech l-l-b" },
        { label: "B.L.L.B.", value: "b-l-l-b" },
        { label: "CSE", value: "cse" },
        { label: "IT", value: "it" },
        { label: "M.Plan", value: "m-plan" },
        { label: "M.Arch", value: "m-arch" },
        { label: "M.Tech L.L.B.", value: "m-tech l-l-b" },
        { label: "M.L.L.B.", value: "m-l-l-b" },
        { label: "B.A", value: "b-a" },
        { label: "B.A (Hons)", value: "b-a (hons)" },
        { label: "M.A", value: "m-a" },
        { label: "M.A (Hons)", value: "m-a (hons)" },
        { label: "M.Phil", value: "m-phil" },
        { label: "B.Sc", value: "b-sc" },
        { label: "B.Sc (Hons)", value: "b-sc (hons)" },
        { label: "M.Sc", value: "m-sc" },
        { label: "M.Sc (Hons)", value: "m-sc (hons)" },
        { label: "M.Lib.I.Sc", value: "m-lib-i-sc" },
        { label: "M.Lib.Sc", value: "m-lib-sc" },
        { label: "B.Lib.I.Sc", value: "b-lib-i-sc" },
        { label: "B.Lib.Sc", value: "b-lib-sc" },
        { label: "B.Com", value: "b-com" },
        { label: "M.Com", value: "m-com" },
        { label: "B.Com (Hons)", value: "b-com (hons)" },
        { label: "M.Com (Hons)", value: "m-com (hons)" },
        { label: "CA / CPA", value: "ca / cpa" },
        { label: "CFA", value: "cfa" },
        { label: "CS", value: "cs" },
        { label: "BBM", value: "bbm" },
        { label: "BCM", value: "bcm" },
        { label: "BBA", value: "bba" },
        { label: "MBA", value: "mba" },
        { label: "MBA (Finance)", value: "mba (finance)" },
        { label: "Executive MBA", value: "executive mba" },
        { label: "PGDM", value: "pgdm" },
        { label: "PGDBM", value: "pgdbm" },
        { label: "PGDCA", value: "pgdca" },
        { label: "CPT", value: "cpt" },
        { label: "CIA", value: "cia" },
        { label: "ICWA", value: "icwa" },
        { label: "MFC", value: "mfc" },
        { label: "MFM", value: "mfm" },
        { label: "BFIA", value: "bfia" },
        { label: "BBS", value: "bbs" },
        { label: "BIBF", value: "bibf" },
        { label: "BIT", value: "bit" },
        { label: "BCA", value: "bca" },
        { label: "B.Sc IT", value: "b-sc it" },
        { label: "B.Sc Computer Science", value: "b-sc computer science" },
        { label: "PGDCA", value: "pgdca" },
        { label: "ADCA", value: "adca" },
        { label: "DCA", value: "dca" },
        { label: "DOEACC", value: "doeacc" },
        { label: "NIIT", value: "niit" },
        { label: "J.J.T.I", value: "j-j-t-i" },
        { label: "D. Pharma", value: "d-pharma" },
        { label: "B. Pharma", value: "b-pharma" },
        { label: "M. Pharma", value: "m-pharma" },
        { label: "LL.B", value: "ll-b" },
        { label: "LL.M", value: "ll-m" },
        { label: "Diploma", value: "diploma" },
        { label: "Monograph", value: "monograph" },
        { label: "Doctorate", value: "doctorate" },
        { label: "Associate", value: "associate" },
        { label: "High School", value: "high school" },
        { label: "Less than High School", value: "less than high school" },
        { label: "Diploma in Trade School", value: "diploma in trade school" },
        { label: "Uneducated", value: "uneducated" },
        { label: "5th Pass", value: "5th pass" },
        { label: "8th Pass", value: "8th pass" },
        { label: "10th Pass", value: "10th pass" },
        { label: "10+2 Pass", value: "10+2 pass" },
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

    useHireFormStore.setState((state) => ({
      formValue: { ...state.formValue, ...data, certificates: files[0] ?? "" },
    }));
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
