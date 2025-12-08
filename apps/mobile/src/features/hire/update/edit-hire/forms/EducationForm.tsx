import { zodResolver } from "@hookform/resolvers/zod";
import { educationSchema } from "@repo/db/dist/schema/hire.schema";
import { type FieldErrors, useForm } from "react-hook-form";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import type z from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/forms/formComponent";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { useHireFormStore } from "@/features/hire/shared/store/useCreateHireStore";
import type { UserHireListingType } from "..";

type EducationSchema = z.infer<typeof educationSchema>;

export default function EducatonForm({
  hireListing,
}: {
  hireListing: UserHireListingType;
}) {
  const setFormValue = useHireFormStore((s) => s.setFormValue);
  const nextPage = useHireFormStore((s) => s.nextPage);
  const prevPage = useHireFormStore((s) => s.prevPage);

  const {
    control,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<EducationSchema>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      highestQualification: hireListing?.highestQualification ?? "",
      skillset: hireListing?.skillset ?? "",
      employmentStatus: hireListing?.employmentStatus ?? "",
      workExperienceYear: hireListing?.workExperienceYear ?? 0,
      workExperienceMonth: hireListing?.workExperienceMonth ?? 0,
      jobRole: hireListing?.jobRole ?? "",
      previousJobRole: hireListing?.previousJobRole ?? "",
      certificates: hireListing?.certificates ?? "",
    },
  });
  const onError = (errors: FieldErrors<EducationSchema>) => {
    const fisrtError = Object.keys(errors)[0] as keyof EducationSchema;
    setFocus(fisrtError);
  };
  const onSubmit = (data: EducationSchema) => {
    setFormValue("highestQualification", data.highestQualification);
    setFormValue("skillset", data.skillset ?? "");
    setFormValue("employmentStatus", data.employmentStatus ?? "");
    setFormValue("workExperienceYear", data.workExperienceYear ?? 0);
    setFormValue("workExperienceMonth", data.workExperienceMonth ?? 0);
    setFormValue("jobRole", data.jobRole ?? "");
    setFormValue("previousJobRole", data.previousJobRole ?? "");
    setFormValue("certificates", data.certificates ?? "");
    nextPage();
  };

  const formFields: FormFieldProps<EducationSchema>[] = [
    {
      control,
      name: "highestQualification",
      label: "Highest Qualification",
      component: "dropdown",
      data: [
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
      placeholder: "Select highest qualification",
      error: errors.highestQualification?.message,
    },
    {
      control,
      name: "skillset",
      label: "Skill Sets",
      placeholder: "e.g. Sales, Marketing etc.",
      component: "input",
      required: false,
      error: errors.skillset?.message,
    },
    {
      control,
      name: "employmentStatus",
      label: "Currently Employed",
      component: "dropdown",
      data: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
      placeholder: "Select employment status",
      error: errors.employmentStatus?.message,
    },
    {
      control,
      name: "workExperienceYear",
      label: "Work Experience Year",
      component: "dropdown",
      data: [
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
      placeholder: "Select work experience year",
      error: errors.workExperienceYear?.message,
    },
    {
      control,
      name: "workExperienceMonth",
      label: "Work Experience Month",
      component: "dropdown",
      data: [
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
      required: false,
      placeholder: "Select work experience month",
      error: errors.workExperienceMonth?.message,
    },
    {
      control,
      name: "jobRole",
      label: "Job Role",
      component: "input",
      error: errors.jobRole?.message,
    },
    {
      control,
      name: "previousJobRole",
      label: "Worked As (Designation)",
      component: "input",
      required: false,
      error: errors.previousJobRole?.message,
    },
    {
      control,
      name: "certificates",
      label: "Certificates",
      component: "image",
      placeholder: "Select Image",
      required: false,
    },
  ];
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={80}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 16 }}
      >
        <View className="mx-auto w-[90%]">
          {formFields.map((field) => (
            <FormField key={field.name} {...field} />
          ))}
        </View>

        <View className="flex-row justify-between w-[90%] self-center mt-6 mb-24">
          <View className="w-[45%]">
            <PrimaryButton title="Back" variant="outline" onPress={prevPage} />
          </View>
          <View className="w-[45%]">
            <PrimaryButton
              title="Next"
              isLoading={isSubmitting}
              onPress={handleSubmit(onSubmit, onError)}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}
