import { zodResolver } from "@hookform/resolvers/zod";
import { educationSchema } from "@repo/db/dist/schema/hire.schema";
import { useForm } from "react-hook-form";
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
import type { OutputTrpcType } from "@/lib/trpc";

type EducationSchema = z.infer<typeof educationSchema>;
export type AddHirePageType = OutputTrpcType["hirerouter"]["add"] | null;
export default function EducatonForm() {
  const setFormValue = useHireFormStore((s) => s.setFormValue);
  const formValue = useHireFormStore((s) => s.formValue);
  const nextPage = useHireFormStore((s) => s.nextPage);
  const prevPage = useHireFormStore((s) => s.prevPage);

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
      workExperienceMonth: formValue.workExperienceMonth ?? 0,
      jobRole: formValue.jobRole ?? "",
      previousJobRole: formValue.previousJobRole ?? "",
      certificates: formValue.certificates ?? "",
    },
  });

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
      className: "w-[90%] bg-base-200",
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
      placeholder: "Select work experience month",
      error: errors.workExperienceMonth?.message,
    },
    {
      control,
      name: "jobRole",
      label: "Job Role",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.jobRole?.message,
    },
    {
      control,
      name: "previousJobRole",
      label: "Worked As (Designation)",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.previousJobRole?.message,
    },
    {
      control,
      name: "certificates",
      label: "Certificates",
      component: "image",
      className: "w-[100%]",
    },
  ];
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
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

          <View className="flex-row justify-between w-[90%] self-center mt-6 mb-60">
            <View className="w-[45%]">
              <PrimaryButton
                title="Back"
                variant="outline"
                onPress={prevPage}
              />
            </View>
            <View className="w-[45%]">
              <PrimaryButton
                title="Next"
                isLoading={isSubmitting}
                onPress={handleSubmit(onSubmit)}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
