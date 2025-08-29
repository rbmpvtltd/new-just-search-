import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Keyboard,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  FormField,
  type FormFieldProps,
} from "@/components/forms/formComponent";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { MY_HIRE_URL } from "@/constants/apis";
import { hours } from "@/data/dummy";
import { useSuspenceData } from "@/query/getAllSuspense";
import { useMyHire } from "@/query/myHire";
import {
  type PrefferedProfessionType,
  prefferedProfessionSchema,
} from "@/schemas/prefferedProfession";
import useFormValidationStore from "@/store/formHireStore";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function PreferredProfession() {
  const setFormValue = useFormValidationStore((s) => s.setFormValue);
  const setPage = useFormValidationStore((s) => s.setPage);

  const { editHire } = useLocalSearchParams();
  const { data: myHire } = useSuspenceData(MY_HIRE_URL.url, MY_HIRE_URL.key);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PrefferedProfessionType>({
    resolver: zodResolver(prefferedProfessionSchema),
    defaultValues: {
      job_type: [],
      location_preferred: "",
      work_shift: [],
      expected_salary_from: "",
      expected_salary_to: "",
      from_hour: "",
      from_period: "AM",
      to_hour: "",
      to_period: "PM",
      job_duration: [],
      relocate: 0,
      availability: "",
    },
  });

  useEffect(() => {
    if (!myHire || !editHire) return;
    const myHireData = myHire.data.data.find(
      (item: any) => item.id == editHire,
    );

    if (!myHireData) return;

    let from_hour = "";
    let from_period = "";
    let to_hour = "";
    let to_period = "";
    const workingHours = myHireData.preferred_working_hours;
    if (workingHours) {
      const [from, to] = workingHours.split(" - ");
      [from_hour, from_period] = from.split(" ");
      [to_hour, to_period] = to.split(" ");
    }
    myHireData.from_hour = from_hour;
    myHireData.from_period = from_period;
    myHireData.to_hour = to_hour;
    myHireData.to_period = to_period;

    reset({
      job_type: myHireData.job_type?.split(",") ?? [],
      location_preferred: myHireData?.location_preferred ?? "",
      work_shift: myHireData.work_shift?.split(",") ?? [],
      expected_salary_from: myHireData.expected_salary_from ?? "",
      expected_salary_to: myHireData.expected_salary_to ?? "",
      from_hour: myHireData.from_hour,
      from_period: myHireData.from_period,
      to_hour: myHireData.to_hour,
      to_period: myHireData.to_period,
      job_duration: myHireData.job_duration?.split(",") ?? [],
      relocate: myHireData.relocate,
      availability: myHireData.availability ?? "",
    });
  }, [myHire, reset, editHire]);

  const onSubmit = (data: PrefferedProfessionType) => {
      setFormValue("job_type", data.job_type);
    setFormValue("location_preferred", data.location_preferred ?? "");
      setFormValue("work_shift", data.work_shift);
    setFormValue("expected_salary_from", data.expected_salary_from ?? "");
    setFormValue("expected_salary_to", data.expected_salary_to ?? "");
    setFormValue("from_hour", data.from_hour);
    setFormValue("from_period", data.from_period);
    setFormValue("to_hour", data.to_hour);
    setFormValue("to_period", data.to_period);
      setFormValue("job_duration", data.job_duration);
    setFormValue("relocate", data.relocate);
    setFormValue("availability", data.availability ?? "");

    router.push({
      pathname: "/editHire/attachments",
      params: { editHire: editHire },
    });
  };
  const formFields: FormFieldProps[] = [
    {
      control,
      name: "job_type",
      label: "Job Type",
      component: "checkbox",
      className: "w-[90%] text-secondary",
      data: [
        { label: "Full Time", value: "full time" },
        { label: "Part Time", value: "part time" },
      ],
      error: errors.job_type?.message,
    },
    {
      control,
      name: "location_preferred",
      label: "Location Preference",
      component: "input",
      className: "w-[90%] bg-base-200",
      placeholder: "e.g. Jodhpur, Jaipur, Udaipur etc.",
      error: errors.location_preferred?.message,
    },
    {
      control,
      name: "work_shift",
      label: "Work Shift",
      component: "checkbox",
      data: [
        { label: "Morning Shift", value: "morning_shift" },
        { label: "Evening Shift", value: "evening_shift" },
        { label: "Night Shift", value: "night_shift" },
      ],
      error: errors.work_shift?.message,
    },
    {
      control,
      name: "expected_salary_from",
      label: "Salary Expectation From ",
      placeholder: "Enter your salary expectation",
      keyboardType: "numeric",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.expected_salary_from?.message,
    },
    {
      control,
      name: "expected_salary_to",
      label: " To ",
      placeholder: "Enter your salary expectation",
      keyboardType: "numeric",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.expected_salary_to?.message,
    },
    {
      control,
      name: "job_duration",
      label: "Job Duration",
      component: "checkbox",
      data: [
        { label: "Day", value: "day" },
        { label: "Week", value: "week" },
        { label: "Month", value: "month" },
        { label: "Year", value: "year" },
        { label: "Few Years", value: "few years" },
      ],
      error: errors.job_duration?.message,
    },
    {
      control,
      name: "relocate",
      label: "Relocate?",
      component: "dropdown",
      data: [
        { label: "Yes", value: 1 },
        { label: "No", value: 2 },
      ],
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
            <FormField key={idx} {...field} />
          ))}
          {/* --- Working Hour From --- */}
          <View className="w-[90%] mx-auto mt-4">
            <Text className="text-secondary font-medium mb-2">
              Working Hour From
            </Text>
            <View className="flex-row gap-x-2">
              <View className="flex-1">
                <FormField
                  control={control}
                  name="from_hour"
                  component="dropdown"
                  data={hours}
                  className="bg-base-200 rounded-lg"
                  error={errors.from_hour?.message}
                  label=""
                  labelHidden
                  dropdownPosition="top"
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
                  className="bg-base-200 rounded-lg "
                  error={errors.from_period?.message}
                  label=""
                  labelHidden
                  dropdownPosition="top"
                />
              </View>
            </View>
          </View>

          {/* --- Working Hour To --- */}
          <View className="w-[90%] mx-auto mt-4">
            <Text className="text-secondary font-medium mb-2">
              Working Hour To
            </Text>
            <View className="flex-row gap-x-2 w-[100%]">
              <View className="flex-1">
                <FormField
                  control={control}
                  name="to_hour"
                  component="dropdown"
                  data={hours}
                  className="bg-base-200 rounded-lg"
                  error={errors.to_hour?.message}
                  label=""
                  labelHidden
                  dropdownPosition="top"
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
                  className="bg-base-200 rounded-lg w-[35%]"
                  error={errors.to_period?.message}
                  label=""
                  labelHidden
                  dropdownPosition="top"
                />
              </View>
            </View>
          </View>
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
