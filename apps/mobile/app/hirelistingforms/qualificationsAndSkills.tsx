import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Keyboard,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  FormField,
  type FormFieldProps,
} from "@/components/forms/formComponent";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { experienceMonths, experienceYears, qualification } from "@/data/dummy";
import {
  type QualificationsAndSkillsFormType,
  qualificationsAndSkillsFormSchema,
} from "@/schemas/qualificationsAndSkillsFormSchema";
import useFormValidationStore from "@/store/formHireStore";

export default function QualificationsAndSkills() {
  const setPage = useFormValidationStore((s) => s.setPage);
  const setFormValue = useFormValidationStore((s) => s.setFormValue);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QualificationsAndSkillsFormType>({
    resolver: zodResolver(qualificationsAndSkillsFormSchema),
    defaultValues: {
      highest_qualification: "",
      skillset: "",
      employment_status: "",
      work_experience_year: "",
      work_experience_month: "",
      job_role: "",
      previous_job_role: "",
      certificates: "",
    },
  });

  const onSubmit = (data: QualificationsAndSkillsFormType) => {
    setFormValue("highest_qualification", data.highest_qualification);
    setFormValue("skillsets", data.skillset);
    setFormValue("employment_status", data.employment_status);
    setFormValue("work_experience_year", data.work_experience_year);
    setFormValue("work_experience_month", data.work_experience_month);
    setFormValue("job_role", data.job_role);
    setFormValue("previous_job_role", data.previous_job_role);
    setFormValue("certificates", data.certificates ?? "");

    setPage(2);
    router.push("/hirelistingforms/preferredProfession");
  };

  const formFields: FormFieldProps[] = [
    {
      control,
      name: "highest_qualification",
      label: "Highest Qualification",
      component: "dropdown",
      data: qualification,
      placeholder: "Select highest qualification",
      error: errors.highest_qualification?.message,
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
      name: "employment_status",
      label: "Currently Employed",
      component: "dropdown",
      data: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
      placeholder: "Select employment status",
      error: errors.employment_status?.message,
    },
    {
      control,
      name: "work_experience_year",
      label: "Work Experience Year",
      component: "dropdown",
      data: experienceYears,
      placeholder: "Select work experience year",
      error: errors.work_experience_year?.message,
    },
    {
      control,
      name: "work_experience_month",
      label: "Work Experience Month",
      component: "dropdown",
      data: experienceMonths,
      placeholder: "Select work experience month",
      error: errors.work_experience_month?.message,
    },
    {
      control,
      name: "job_role",
      label: "Job Role",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.job_role?.message,
    },
    {
      control,
      name: "previous_job_role",
      label: "Worked As (Designation)",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.previous_job_role?.message,
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        className="w-[100%] h-full"
        extraScrollHeight={0}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mx-auto w-[90%]">
          {formFields.map((field, idx) => (
            <FormField key={idx} {...field} />
          ))}
        </View>
        <View className="w-[37%] mx-auto m-4">
          <PrimaryButton
            isLoading={isSubmitting}
            title="Next"
            loadingText="Processing..."
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              marginLeft: "auto",
              marginRight: "auto",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
            textClassName="text-secondary text-lg font-semibold"
            disabled={isSubmitting}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}
