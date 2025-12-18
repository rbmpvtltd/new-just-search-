import { zodResolver } from "@hookform/resolvers/zod";
import { businessTimingSchema } from "@repo/db/dist/schema/business.schema";
import { useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";
import type z from "zod";
import { FormField } from "@/components/forms/formComponent";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { useBusinessFormStore } from "@/features/business/shared/store/useCreateBusinessStore";
import { toISOStringTime } from "@/utils/timeFormat";

type BusinessTimingSchema = z.infer<typeof businessTimingSchema>;
export default function BusinessTiming() {
  const setFormValue = useBusinessFormStore((s) => s.setFormValue);
  const formValue = useBusinessFormStore((s) => s.formValue);
  const nextPage = useBusinessFormStore((s) => s.nextPage);
  const prevPage = useBusinessFormStore((s) => s.prevPage);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<BusinessTimingSchema>({
    resolver: zodResolver(businessTimingSchema),
    defaultValues: {
      days: formValue.days ?? [],
      fromHour: formValue.fromHour ?? "",
      toHour: formValue.toHour ?? "",
    },
  });

  const onSubmit = (data: BusinessTimingSchema) => {
    const formatFromHour = toISOStringTime(data?.fromHour ?? "");
    const formatToHour = toISOStringTime(data?.toHour ?? "");

    setFormValue("days", data.days ?? []);
    setFormValue("fromHour", formatFromHour ?? "");
    setFormValue("toHour", formatToHour ?? "");
    nextPage();
  };

  return (
    <ScrollView className="p-4 ">
      <Text className="text-2xl font-semibold mb-6 text-secondary text-center">
        Add Business Timings
      </Text>

      <View className="w-[90%] mx-auto ">
        <View className=" flex-row gap-x-2">
          <View className="flex-1">
            <FormField
              label=""
              control={control}
              name="fromHour"
              component="datepicker"
              mode="time"
              className="w-fit"
              required={false}
              placeholder="Opening Time"
            />
          </View>
          <View className="flex-1">
            <FormField
              label=""
              control={control}
              name="toHour"
              component="datepicker"
              mode="time"
              className="w-fit"
              required={false}
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
            data={[
              { label: "Monday", value: "monday" },
              { label: "Tuesday", value: "tuesday" },
              { label: "Wednesday", value: "wednesday" },
              { label: "Thursday", value: "thursday" },
              { label: "Friday", value: "friday" },
              { label: "Saturday", value: "saturday" },
              { label: "Sunday", value: "sunday" },
            ]}
            component="multiselectdropdown"
            required={false}
            className="w-fit bg-base-200"
            dropdownPosition="bottom"
          />
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
    </ScrollView>
  );
}
