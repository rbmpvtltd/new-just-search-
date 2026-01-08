"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  JobDuration,
  JobType,
  WorkShift,
} from "@repo/db/dist/enum/allEnum.enum";
import { preferredPositionSchema } from "@repo/db/dist/schema/hire.schema";
import { useForm } from "react-hook-form";
import type z from "zod";
import { FormField } from "@/components/form/form-component";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useHireFormStore } from "@/features/hire/shared/store/useCreateHireStore";
import type { UserHireListingType } from "..";

type PreferredPositionSchema = z.infer<typeof preferredPositionSchema>;
export default function PreferredPositionForm({
  hireListing,
}: {
  hireListing: UserHireListingType;
}) {
  const setFormValue = useHireFormStore((state) => state.setFormValue);
  const prevPage = useHireFormStore((state) => state.prevPage);
  const formValue = useHireFormStore((state) => state.formValue);
  const nextPage = useHireFormStore((state) => state.nextPage);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PreferredPositionSchema>({
    resolver: zodResolver(preferredPositionSchema),
    defaultValues: {
      jobType:
        formValue?.jobType.length === 0
          ? hireListing?.hire?.jobType
          : (formValue?.jobType ?? []),
      locationPreferred:
        formValue?.locationPreferred === ""
          ? hireListing?.hire?.locationPreferred
          : (formValue?.locationPreferred ?? ""),
      relocate:
        formValue?.relocate === ""
          ? hireListing?.hire?.relocate
          : (formValue?.relocate ?? ""),
      expectedSalaryFrom:
        formValue?.expectedSalaryFrom === ""
          ? hireListing?.hire?.expectedSalaryFrom
          : (formValue?.expectedSalaryFrom ?? ""),
      expectedSalaryTo:
        formValue.expectedSalaryTo === ""
          ? hireListing?.hire?.expectedSalaryTo
          : (formValue.expectedSalaryTo ?? ""),
      jobDuration:
        formValue?.jobDuration.length === 0
          ? hireListing?.hire?.jobDuration
          : (formValue?.jobDuration ?? []),
      fromHour:
        formValue.fromHour === ""
          ? hireListing?.hire?.fromHour
          : (formValue.fromHour ?? ""),
      toHour:
        formValue.toHour === ""
          ? hireListing?.hire?.toHour
          : (formValue.toHour ?? ""),
      workShift:
        formValue.workShift.length === 0
          ? hireListing?.hire?.workShift
          : (formValue.workShift ?? []),
      availability:
        formValue?.availability === ""
          ? hireListing?.hire?.availability
          : (formValue?.availability ?? ""),
    },
  });

  const onSubmit = (data: PreferredPositionSchema) => {
    setFormValue("jobType", data.jobType ?? "");
    setFormValue("locationPreferred", data.locationPreferred ?? "");
    setFormValue("relocate", data.relocate ?? undefined);
    setFormValue("expectedSalaryFrom", data.expectedSalaryFrom ?? "");
    setFormValue("expectedSalaryTo", data.expectedSalaryTo ?? "");
    setFormValue("jobDuration", data.jobDuration ?? "");
    setFormValue("fromHour", data.fromHour ?? undefined);
    setFormValue("toHour", data.toHour ?? undefined);
    setFormValue("workShift", data.workShift ?? "");
    setFormValue("availability", data.availability ?? "");
    nextPage();
  };
  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl">
        <div className="p-8 space-y-8">
          <div className="p-6 bg-gray-50 rounded-xl shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Preferred Position
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FormField
                type=""
                control={control}
                label="Job Type"
                name="jobType"
                placeholder="Job Type"
                component="checkbox"
                options={Object.values(JobType).map((jobType) => ({
                  label: jobType,
                  value: jobType,
                }))}
                error={errors.jobType?.message}
              />
              <FormField
                type=""
                control={control}
                label="Location Preferred"
                name="locationPreferred"
                placeholder="Enter location"
                component="input"
                required={false}
                error={errors.locationPreferred?.message}
              />
            </div>
            <h3 className="text-base font-medium text-gray-700 mt-3">
              Expected Salary
            </h3>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2  gap-8">
              <div className="flex flex-col space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    type=""
                    control={control}
                    label="From"
                    name="expectedSalaryFrom"
                    placeholder="e.g. 20000"
                    component="input"
                    required={false}
                    error={errors.expectedSalaryFrom?.message}
                  />
                  <FormField
                    type=""
                    control={control}
                    label="To"
                    name="expectedSalaryTo"
                    placeholder="e.g. 50000"
                    component="input"
                    required={false}
                    error={errors.expectedSalaryTo?.message}
                  />
                </div>
              </div>
              <FormField
                type=""
                control={control}
                label="Job Duration"
                name="jobDuration"
                component="checkbox"
                options={Object.values(JobDuration).map((duration) => ({
                  label: duration,
                  value: duration,
                }))}
                required={false}
                error={errors.jobDuration?.message}
              />
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-1 gap-8">
              <div className="flex flex-col space-y-4">
                <h3 className="text-base font-medium text-gray-700">
                  Perffered Working Hours
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <FormField
                    type="time"
                    control={control}
                    label="From Hour"
                    name="fromHour"
                    component="input"
                    required={false}
                    error={errors.fromHour?.message}
                  />
                  <FormField
                    type="time"
                    control={control}
                    label="To Hour"
                    name="toHour"
                    component="input"
                    required={false}
                    error={errors.toHour?.message}
                  />
                  <FormField
                    type=""
                    control={control}
                    label="Relocate"
                    name="relocate"
                    component="select"
                    options={[
                      {
                        label: "Yes",
                        value: "yes",
                      },
                      {
                        label: "No",
                        value: "no",
                      },
                    ]}
                    required={false}
                    error={errors.relocate?.message}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              <FormField
                type=""
                control={control}
                label="Work Shift"
                name="workShift"
                component="checkbox"
                options={Object.values(WorkShift).map((shift) => ({
                  label: shift,
                  value: shift,
                }))}
                error={errors.workShift?.message}
              />
              <FormField
                type=""
                control={control}
                label="Availability for Interview?"
                name="availability"
                placeholder="Availability"
                component="input"
                required={false}
                error={errors.availability?.message}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200 gap-4 bg-gray-50">
          <Button
            onClick={prevPage}
            className="bg-orange-500 hover:bg-orange-700 font-bold"
          >
            PREVIOUS
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-md min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Spinner /> Loading...
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
