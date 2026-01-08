"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessTimingSchema } from "@repo/db/dist/schema/business.schema";
import { useForm } from "react-hook-form";
import type z from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useBusinessFormStore } from "@/features/business/shared/store/useCreateBusinessStore";
import { formatTime, toISOStringTime } from "@/utils/timeFormat";
import type { UserBusinessListingType } from "..";

type BusinessTimingSchema = z.infer<typeof businessTimingSchema>;
export default function BusinessTiming({
  businessListing,
}: {
  businessListing: UserBusinessListingType;
}) {
  const setFormValue = useBusinessFormStore((state) => state.setFormValue);
  const formValue = useBusinessFormStore((state) => state.formValue);
  const nextPage = useBusinessFormStore((state) => state.nextPage);
  const prevPage = useBusinessFormStore((state) => state.prevPage);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessTimingSchema>({
    resolver: zodResolver(businessTimingSchema),
    defaultValues: {
      days:
        formValue.days?.length === 0
          ? businessListing?.business?.days
          : (formValue.days ?? []),
      fromHour:
        formValue.fromHour === ""
          ? businessListing?.business?.fromHour
          : (formValue.fromHour ?? ""),
      toHour:
        formValue.toHour === ""
          ? businessListing?.business?.toHour
          : (formValue.toHour ?? ""),
    },
  });

  const formFields: FormFieldProps<BusinessTimingSchema>[] = [
    {
      control,
      type: "time",
      label: "Opening Time",
      name: "fromHour",
      placeholder: "Opening Time",
      component: "input",
      required: false,
      error: errors.fromHour?.message,
    },
    {
      control,
      type: "time",
      label: "time",
      name: "toHour",
      placeholder: "Closing Time",
      component: "input",
      required: false,
      error: errors.toHour?.message,
    },
  ];

  const onSubmit = (data: BusinessTimingSchema) => {
    const formatFromHour = toISOStringTime(data?.fromHour ?? "");
    const formatToHour = toISOStringTime(data?.toHour ?? "");
    setFormValue("days", data.days ?? []);
    setFormValue("fromHour", formatFromHour ?? "");
    setFormValue("toHour", formatToHour ?? "");
    nextPage();
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl">
        <div className="p-8 space-y-8">
          <div className="p-6 shadow rounded-xl bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Business Timing
            </h2>
            <p className="mt-3 text-sm text-gray-500 italic mb-4">
              Let your customers know when you are available for them
            </p>
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={control}
                type=""
                label="Days"
                name="days"
                placeholder="Days"
                component="multiselect"
                options={[
                  { label: "Monday", value: "monday" },
                  { label: "Tuesday", value: "tuesday" },
                  { label: "Wednesday", value: "wednesday" },
                  { label: "Thursday", value: "thursday" },
                  { label: "Friday", value: "friday" },
                  { label: "Saturday", value: "saturday" },
                  { label: "Sunday", value: "sunday" },
                ]}
                required={false}
                error=""
              />
            </div>
            <div className="flex flex-col space-y-4 mt-4">
              <h3 className="text-base font-medium text-gray-700">
                Perffered Working Hours
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
                {formFields.map((field, index) => (
                  <FormField key={field.name} {...field} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end p-6 border-t border-gray-200 gap-4">
          <Button
            type="submit"
            onClick={prevPage}
            className="bg-orange-500 hover:bg-orange-700 font-bold cursor-pointer"
          >
            PREVIOUS
          </Button>
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-700 font-bold cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Spinner />
                Loading...{" "}
              </>
            ) : (
              "CONTINUE"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
