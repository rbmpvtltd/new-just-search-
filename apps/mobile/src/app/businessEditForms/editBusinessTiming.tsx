import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";
import { FormField } from "@/components/forms/formComponent";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { MY_BUSINESS_LIST_URL } from "@/constants/apis";
import { useSuspenceData } from "@/query/getAllSuspense";
import {
  type BusinessDetailData,
  businessDetailSchema,
} from "@/schemas/businessTimingSchema";
import useBusinessFormValidationStore from "@/store/businessFormStore";

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

export default function EditBusinessTiming() {
  const { editBusiness } = useLocalSearchParams();
  const setFormValue = useBusinessFormValidationStore((s) => s.setFormValue);

  const { data: businessList } = useSuspenceData(
    MY_BUSINESS_LIST_URL.url,
    MY_BUSINESS_LIST_URL.key,
    "",
    true,
  );

  const parsed = JSON.parse(businessList.data.schedules);
  const closedDays = daykeys.filter((day) => parsed[day]?.closed == true);
  const openDays = daykeys.filter((day) => !closedDays.includes(day));

  const methods = useForm<BusinessDetailData>({
    resolver: zodResolver(businessDetailSchema),
    defaultValues: {
      opens_at_hour: parsed[openDays[0]]?.opens_at.split(" ")[0],
      opens_at_period: parsed[openDays[0]]?.opens_at.split(" ")[1],
      closes_at_hour: parsed[openDays[0]]?.closes_at.split(" ")[0],
      closes_at_period: parsed[openDays[0]]?.closes_at.split(" ")[1],
      days: openDays,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  if (!businessList?.data?.schedules) return;

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
    router.push({
      pathname: "/businessEditForms/editContactDetail",
      params: { editBusiness: editBusiness },
    });
  };

  return (
    <FormProvider {...methods}>
      <ScrollView className="p-4 bg-white">
        <Text className="text-2xl font-semibold mb-2 text-secondary text-center">
          Add Business Timings
        </Text>
        <View className="w-[90%] mx-auto ">
          <View className=" flex-row gap-x-2">
            <View className="flex-1">
              <FormField
                label=""
                control={control}
                name="opens_at_hour"
                placeholder="Opens At"
                data={hours()}
                component="dropdown"
                className="w-fit"
              />
            </View>
            <View className="flex-1">
              <FormField
                label=""
                control={control}
                name="opens_at_period"
                placeholder="Opens At"
                data={period}
                component="dropdown"
                className="w-fit"
              />
            </View>
          </View>

          <View className=" flex-row gap-x-2">
            <View className="flex-1">
              <FormField
                label=""
                control={control}
                name="closes_at_hour"
                placeholder="Closes At"
                data={hours()}
                component="dropdown"
                className="w-fit"
              />
            </View>
            <View className="flex-1">
              <FormField
                label=""
                control={control}
                name="closes_at_period"
                placeholder="Opens At"
                data={period}
                component="dropdown"
                className="w-fit"
              />
            </View>
          </View>

          <View className="">
            <View className="flex-1">
              <FormField
                label=""
                control={control}
                name="days"
                placeholder="Days"
                data={daykeys.map((item) => ({
                  label: day[item],
                  value: item,
                }))}
                dropdownPosition="auto"
                component="multiselectdropdown"
                className="w-fit bg-base-200"
              />
            </View>
          </View>
        </View>
        <View className="w-[37%] mx-auto m-6">
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
      </ScrollView>
    </FormProvider>
  );
}
