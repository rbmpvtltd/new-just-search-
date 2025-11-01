import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { ScrollView, Switch, Text, View } from "react-native";
import { FormField } from "@/components/forms/formComponent";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import {
  type BusinessDetailData,
  businessDetailSchema,
} from "@/schemas/businessTimingSchema";
import useBusinessFormValidationStore from "@/store/businessFormStore";
import { UserBusinessListingType } from "..";

const day: Record<string, string> = {
  Sun: "Sunday",
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
};

const daykeys = Object.keys(day);

const hours = () => {
  const hour = [];
  for (let i = 1; i < 13; i++) {
    hour.push({
      label: i.toString(),
      value: i.toString(),
    });
  }
  return hour;
};

const period = [
  {
    label: "AM",
    value: "AM",
  },
  {
    label: "PM",
    value: "PM",
  },
];

export default function BusinessTiming({
  businessListing,
}: {
  businessListing: UserBusinessListingType;
}) {
  const setFormValue = useBusinessFormValidationStore((s) => s.setFormValue);
  const setPage = useBusinessFormValidationStore((s) => s.setPage);

  const methods = useForm<BusinessDetailData>({
    resolver: zodResolver(businessDetailSchema),
    defaultValues: {
      opens_at_hour: "",
      opens_at_period: "",
      closes_at_hour: "",
      closes_at_period: "",
      days: [],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data: BusinessDetailData) => {
    const transfromData = {} as any;
    for (const day of daykeys) {
      if (!data.days) {
        continue;
      }
      if (data.days.includes(day)) {
        transfromData[day] = {
          opens_at: data.opens_at_hour + " " + data.opens_at_period,
          closes_at: data.closes_at_hour + " " + data.closes_at_period,
        };
      } else {
        transfromData[day] = { closed: true };
      }
    }
    setFormValue("schedules", JSON.stringify(transfromData));
    setPage(3);
    router.push("/businessListingForm/contactDetail");
  };

  return (
    <FormProvider {...methods}>
      <ScrollView className="p-4 bg-white">
        <Text className="text-2xl font-semibold mb-6 text-secondary text-center">
          Add Business Timings
        </Text>

        <View className="w-[90%] mx-auto ">
          <View className=" flex-row gap-x-2">
            <View className="flex-1">
              <FormField
                label=""
                control={control}
                name="opens_at_hour"
                data={hours()}
                component="dropdown"
                className="w-fit"
                placeholder="Opening Time"
              />
            </View>
            <View className="flex-1">
              <FormField
                label=""
                control={control}
                name="opens_at_period"
                data={period}
                component="dropdown"
                className="w-fit"
                placeholder="AM/PM"
              />
            </View>
          </View>

          <View className="flex-row gap-x-2">
            <View className="flex-1">
              <FormField
                label=""
                control={control}
                name="closes_at_hour"
                data={hours()}
                component="dropdown"
                className="w-fit"
                placeholder="Closing Time"
              />
            </View>
            <View className="flex-1">
              <FormField
                label=""
                control={control}
                name="closes_at_period"
                data={period}
                component="dropdown"
                className="w-fit"
                placeholder="AM/PM"
              />
            </View>
          </View>

          <View className="">
            <FormField
              label=""
              control={control}
              name="days"
              placeholder="Select Days"
              data={daykeys.map((item) => ({ label: day[item], value: item }))}
              component="multiselectdropdown"
              className="w-fit bg-base-200"
              dropdownPosition="bottom"
            />
          </View>
        </View>

        <View className="flex-row justify-between w-[90%] self-center mt-6 mb-60">
          <View className="w-[45%]">
            <PrimaryButton
              title="Next"
              isLoading={isSubmitting}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </ScrollView>
    </FormProvider>
  );
}
