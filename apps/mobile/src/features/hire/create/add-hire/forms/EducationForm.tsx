import { zodResolver } from "@hookform/resolvers/zod";
import { educationSchema } from "@repo/db/dist/schema/hire.schema";
import { type FieldErrors, useForm } from "react-hook-form";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import type z from "zod";
import { uploadToCloudinary } from "@/components/cloudinary/cloudinary";
import {
  FormField,
  type FormFieldProps,
} from "@/components/forms/formComponent";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { useHireFormStore } from "@/features/hire/shared/store/useCreateHireStore";
import type { OutputTrpcType } from "@/lib/trpc";
import type { AddHirePageType } from "..";

type EducationSchema = z.infer<typeof educationSchema>;

export default function EducatonForm({ data }: { data: AddHirePageType }) {
  const formValue = useHireFormStore((s) => s.formValue);
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

  const onError = (errors: FieldErrors<EducationSchema>) => {
    const fisrtError = Object.keys(errors)[0] as keyof EducationSchema;
    setFocus(fisrtError);
  };
  const onSubmit = async (data: EducationSchema) => {
    const files = await uploadToCloudinary([data?.certificates], "hire");
    useHireFormStore.setState((state) => ({
      formValue: { ...state.formValue, ...data, certificates: files[0] ?? "" },
    }));
    nextPage();
  };

  const formFields: FormFieldProps<EducationSchema>[] = [
    {
      control,
      name: "highestQualification",
      label: "Highest Qualification",
      component: "dropdown",
      data:
        data?.getHighestQualification.map((item) => ({
          label: item.name,
          value: item.id,
        })) ?? [],
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
      error: errors.certificates?.message,
    },
  ];
  return (
    // <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
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
    // </SafeAreaView>
  );
}
