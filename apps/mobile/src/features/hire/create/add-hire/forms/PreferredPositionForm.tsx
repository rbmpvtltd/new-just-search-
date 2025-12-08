import { zodResolver } from "@hookform/resolvers/zod";
import {
  JobDuration,
  JobType,
  WorkShift,
} from "@repo/db/dist/enum/allEnum.enum";
import { preferredPositionSchema } from "@repo/db/dist/schema/hire.schema";
import { useForm } from "react-hook-form";
import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import type z from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/forms/formComponent";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { useHireFormStore } from "@/features/hire/shared/store/useCreateHireStore";

type PreferredPositionSchema = z.infer<typeof preferredPositionSchema>;
export default function PreferredPositionForm() {
  const setFormValue = useHireFormStore((state) => state.setFormValue);
  const formValue = useHireFormStore((s) => s.formValue);
  const nextPage = useHireFormStore((s) => s.nextPage);
  const prevPage = useHireFormStore((s) => s.prevPage);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PreferredPositionSchema>({
    resolver: zodResolver(preferredPositionSchema),
    defaultValues: {
      jobType: formValue.jobType ?? [],
      locationPreferred: formValue.locationPreferred ?? "",
      workShift: formValue.workShift ?? "",
      expectedSalaryFrom: formValue.expectedSalaryFrom ?? "",
      expectedSalaryTo: formValue.expectedSalaryTo ?? "",
      fromHour: formValue.fromHour ?? "",
      toHour: formValue.toHour ?? "",
      jobDuration: formValue.jobDuration ?? "",
      availability: formValue.availability ?? "",
      relocate: formValue.relocate ?? "",
    },
  });

  const onSubmit = (data: PreferredPositionSchema) => {
    setFormValue("jobType", data.jobType);
    setFormValue("locationPreferred", data.locationPreferred ?? "");
    setFormValue("workShift", data.workShift);
    setFormValue("expectedSalaryFrom", data.expectedSalaryFrom ?? "");
    setFormValue("expectedSalaryTo", data.expectedSalaryTo ?? "");
    setFormValue("fromHour", data.fromHour ?? "");
    setFormValue("toHour", data.toHour ?? "");
    setFormValue("jobDuration", data.jobDuration);
    setFormValue("relocate", data.relocate ?? "");
    setFormValue("availability", data.availability ?? "");
    nextPage();
  };
  const formFields: FormFieldProps<PreferredPositionSchema>[] = [
    {
      control,
      name: "jobType",
      label: "Job Type",
      component: "checkbox",
      className: "w-[90%] text-secondary",
      data: Object.values(JobType).map((jobType) => ({
        label: jobType,
        value: jobType,
      })),
      error: errors.jobType?.message,
    },
    {
      control,
      name: "locationPreferred",
      label: "Location Preference",
      component: "input",
      required: false,
      placeholder: "e.g. Delhi, Mumbai, Pune, etc.",
      error: errors.locationPreferred?.message,
    },
    {
      control,
      name: "workShift",
      label: "Work Shift",
      component: "checkbox",
      data: Object.values(WorkShift).map((shift) => ({
        label: shift,
        value: shift,
      })),
      error: errors.workShift?.message,
    },
    {
      control,
      name: "expectedSalaryFrom",
      label: "Salary Expectation From ",
      placeholder: "Enter your salary expectation",
      keyboardType: "numeric",
      component: "input",
      required: false,
      error: errors.expectedSalaryFrom?.message,
    },
    {
      control,
      name: "expectedSalaryTo",
      label: "To",
      placeholder: "Enter your salary expectation",
      keyboardType: "numeric",
      component: "input",
      required: false,
      error: errors.expectedSalaryTo?.message,
    },
    {
      control,
      name: "jobDuration",
      label: "Job Duration",
      component: "checkbox",
      data: Object.values(JobDuration).map((duration) => ({
        label: duration,
        value: duration,
      })),
      error: errors.jobDuration?.message,
    },
    {
      control,
      name: "relocate",
      label: "Relocate?",
      component: "dropdown",
      data: [
        {
          label: "Yes",
          value: "yes",
        },
        {
          label: "No",
          value: "no",
        },
      ],
      required: false,
      dropdownPosition: "top",
      placeholder: "Select Option",
      error: errors.relocate?.message,
    },
    {
      control,
      name: "availability",
      label: "Availability for Interview?",
      component: "input",
      required: false,
      error: errors.availability?.message,
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
            <FormField key={field.name} {...field} />
          ))}
          <View className="w-[90%] mt-4">
            <Text className="text-secondary ml-4 font-medium">
              Working Hour From
            </Text>
            <View className="flex-row mt-4 w-[50%]">
              {/* <View className="flex"> */}
              <FormField
                label=""
                control={control}
                name="fromHour"
                component="datepicker"
                mode="time"
                // className="w-[20%] mt-0"
                required={false}
                placeholder="Opening Time"
              />
              {/* </View> */}
              {/* <View className="flex"> */}
              <FormField
                label=""
                control={control}
                name="toHour"
                component="datepicker"
                mode="time"
                className="w-[20%] mt-0"
                required={false}
                placeholder="AM/PM"
              />
              {/* </View> */}
            </View>
          </View>
        </View>
        <View className="flex-row justify-between w-[90%] self-center mt-6 mb-24">
          <View className="w-[45%]">
            <PrimaryButton title="Back" variant="outline" onPress={prevPage} />
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
  );
}
