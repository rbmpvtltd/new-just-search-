import { zodResolver } from "@hookform/resolvers/zod";
import {
  preferredPositionSchema,
} from "@repo/db/dist/schema/hire.schema";
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
import type { OutputTrpcType } from "@/lib/trpc";
import type { UserHireListingType } from "..";
import { jobDurationEnum, jobTypeEnum, workShiftEnum } from "@repo/db/dist/enum/allEnum.enum";

type PreferredPositionSchema = z.infer<typeof preferredPositionSchema>;

export default function PreferredPositionForm({
  hireListing,
}: {
  hireListing: UserHireListingType;
}) {
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
      jobType: hireListing?.jobType ?? [],
      locationPreferred: hireListing?.locationPreferred ?? "",
      workShift: hireListing?.workShift ?? [],
      expectedSalaryFrom: hireListing?.expectedSalaryFrom ?? "",
      expectedSalaryTo: hireListing?.expectedSalaryTo ?? "",
      preferredWorkingHours: hireListing?.preferredWorkingHours ?? "",
      jobDuration: hireListing?.jobDuration ?? [],
      availability: hireListing?.availability ?? "",
      relocate: hireListing?.relocate ?? "",
    },
  });

  const onSubmit = (data: PreferredPositionSchema) => {
    setFormValue("jobType", data.jobType);
    setFormValue("locationPreferred", data.locationPreferred ?? "");
    setFormValue("workShift", data.workShift);
    setFormValue("expectedSalaryFrom", data.expectedSalaryFrom ?? "");
    setFormValue("expectedSalaryTo", data.expectedSalaryTo ?? "");
    // setFormValue("from_hour", data.from_hour);
    // setFormValue("from_period", data.from_period);
    // setFormValue("to_hour", data.to_hour);
    // setFormValue("to_period", data.to_period);
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
      data: Object.values(jobTypeEnum).map((jobType) => ({
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
      className: "w-[90%] bg-base-200",
      placeholder: "e.g. Delhi, Mumbai, Pune, etc.",
      error: errors.locationPreferred?.message,
    },
    {
      control,
      name: "workShift",
      label: "Work Shift",
      component: "checkbox",
      data: Object.values(workShiftEnum).map((shift) => ({
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
      className: "w-[90%] bg-base-200",
      error: errors.expectedSalaryFrom?.message,
    },
    {
      control,
      name: "expectedSalaryTo",
      label: "To",
      placeholder: "Enter your salary expectation",
      keyboardType: "numeric",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.expectedSalaryTo?.message,
    },
    {
      control,
      name: "jobDuration",
      label: "Job Duration",
      component: "checkbox",
      data: Object.values(jobDurationEnum).map((duration) => ({
        label: duration,
        value: duration,
      })),
      error: errors.jobDuration?.message,
    },
    {
      control,
      name: "relocate",
      label: "relocate?",
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
      dropdownPosition: "top",
      placeholder: "Select Option",
      error: errors.relocate?.message,
    },
    {
      control,
      name: "availability",
      label: "Availability for Interview?",
      component: "input",
      className: "w-[90%] bg-base-200",
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
          {/* --- Working Hour From --- */}
          <View className="w-[90%] mx-auto mt-4">
            <Text className="text-secondary font-medium mb-2">
              Working Hour From
            </Text>
            {/* <View className="flex-row gap-x-2 ">
              <View className="flex-1 ">
                <FormField
                  control={control}
                  name="from_hour"
                  component="dropdown"
                  data={hours}
                  className="bg-base-200 rounded-md"
                  error={errors.from_hour?.message}
                  label=""
                  labelHidden
                  dropdownPosition="top"
                  placeholder="Select Hour"
                />
              </View>
              <View className="flex-1">
                <FormField
                  control={control}
                  name="from_period"
                  component="dropdown"
                  data={[
                    { label: "AM", value: "AM" },
                    { label: "PM", value: "PM" },
                  ]}
                  className="bg-base-200 rounded-md"
                  error={errors.from_period?.message}
                  label=""
                  labelHidden
                  dropdownPosition="top"
                  placeholder="Select Period"
                />
              </View>
            </View> */}
          </View>

          {/* --- Working Hour To --- */}
          <View className="w-[90%] mx-auto mt-4">
            <Text className="text-secondary font-medium mb-2">
              Working Hour To
            </Text>
            {/* <View className="flex-row gap-x-2 w-[100%]">
              <View className="flex-1">
                <FormField
                  control={control}
                  name="to_hour"
                  component="dropdown"
                  data={hours}
                  className="bg-base-200 rounded-md"
                  error={errors.to_hour?.message}
                  label=""
                  labelHidden
                  dropdownPosition="top"
                  placeholder="Select Hour"
                />
              </View>
              <View className="flex-1">
                <FormField
                  control={control}
                  name="to_period"
                  component="dropdown"
                  data={[
                    { label: "AM", value: "AM" },
                    { label: "PM", value: "PM" },
                  ]}
                  className="bg-base-200 w-[35%] rounded-md"
                  error={errors.to_period?.message}
                  label=""
                  labelHidden
                  dropdownPosition="top"
                  placeholder="Select Period"
                />
              </View>
            </View> */}
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
