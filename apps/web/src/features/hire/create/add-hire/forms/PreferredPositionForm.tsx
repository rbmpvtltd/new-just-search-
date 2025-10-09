"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { type Control, type FieldValues, useForm } from "react-hook-form";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  HOURS,
  JOB_DURATION,
  JOB_TYPE,
  PERIOD,
  WORK_SHIFT,
  YES_NO_OPTIONS,
} from "@/features/hire/shared/constants/hire";
import {
  type PreferredPosition,
  preferredPositionSchema,
} from "@/features/hire/shared/schemas/preferred-position.schema";
import { useHireFormStore } from "@/features/hire/shared/store/useCreateHireStore";

export default function PreferredPositionForm() {
  const { page, prevPage, nextPage, setFormValue, formValue } =
    useHireFormStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PreferredPosition>({
    resolver: zodResolver(preferredPositionSchema),
    defaultValues: {
      jobType: formValue.jobType ?? [],
      // locationPreferred: formValue.locationPreferred ?? "",
      // relocate: formValue.relocate ?? undefined,
      // expectedSalaryFrom: formValue.expectedSalaryFrom ?? "",
      // expectedSalaryTo: formValue.expectedSalaryTo ?? "",
      // jobDuration: formValue.jobDuration ?? [],
      // fromHour: formValue.fromHour ?? undefined,
      // fromPeriod: formValue.fromPeriod ?? undefined,
      // toHour: formValue.toHour ?? undefined,
      // toPeriod: formValue.toPeriod ?? undefined,
      // workShift: formValue.workShift ?? [],
      availability: formValue.availability ?? "",
    },
  });

  const onSubmit = (data: PreferredPosition) => {
    console.log("jobType", data.jobType);

    setFormValue("jobType", data.jobType ?? "");
    // setFormValue("locationPreferred", data.locationPreferred ?? "");
    // setFormValue("relocate", data.relocate ?? undefined);
    // setFormValue("expectedSalaryFrom", data.expectedSalaryFrom ?? "");
    // setFormValue("expectedSalaryTo", data.expectedSalaryTo ?? "");
    // setFormValue("jobDuration", data.jobDuration ?? "");
    // setFormValue("fromHour", data.fromHour ?? undefined);
    // setFormValue("fromPeriod", data.fromPeriod ?? undefined);
    // setFormValue("toHour", data.toHour ?? undefined);
    // setFormValue("toPeriod", data.toPeriod ?? undefined);
    // setFormValue("workShift", data.workShift ?? "");
    setFormValue("availability", data.availability ?? "");
    nextPage();
    console.log("data", data);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden"
      >
        <div className="p-10 space-y-10">
          <div className="border border-gray-200 p-8 rounded-xl bg-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
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
                options={[...JOB_TYPE]}
                error={errors.jobType?.message}
              />
              {/*   <FormField
                type=""
                control={control}
                label="Location Preferred"
                name="locationPreferred"
                placeholder="Enter location"
                component="input"
                required={false}
                error={errors.locationPreferred?.message}
              />
              <FormField
                type=""
                control={control}
                label="Relocate"
                name="relocate"
                component="select"
                options={[...YES_NO_OPTIONS]}
                required={false}
                error={errors.relocate?.message}
              /> */}
            </div>
            <h3 className="text-base font-medium text-gray-700 mt-3">
              Expected Salary
            </h3>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2  gap-8">
              <div className="flex flex-col space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* <FormField
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
                  /> */}
                </div>
              </div>
              {/* <FormField
                type=""
                control={control}
                label="Job Duration"
                name="jobDuration"
                component="checkbox"
                options={[...JOB_DURATION]}
                required={false}
                error={errors.jobDuration?.message}
              /> */}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-1 gap-8">
              <div className="flex flex-col space-y-4">
                <h3 className="text-base font-medium text-gray-700">
                  Perffered Working Hours
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {/* <FormField
                    type=""
                    control={control}
                    label="From Hour"
                    name="fromHour"
                    component="select"
                    options={[...HOURS]}
                    required={false}
                    error={errors.fromHour?.message}
                  />
                  <FormField
                    type=""
                    control={control}
                    label="From Period"
                    name="fromPeriod"
                    component="select"
                    options={[...PERIOD]}
                    required={false}
                    error={errors.fromPeriod?.message}
                  />
                  <FormField
                    type=""
                    control={control}
                    label="To Hour"
                    name="toHour"
                    component="select"
                    options={[...HOURS]}
                    required={false}
                    error={errors.toHour?.message}
                  />
                  <FormField
                    type=""
                    control={control}
                    label="To Period"
                    name="toPeriod"
                    component="select"
                    options={[...PERIOD]}
                    required={false}
                    error={errors.toPeriod?.message}
                  /> */}
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {/* <FormField
                type=""
                control={control}
                label="Work Shift"
                name="workShift"
                component="checkbox"
                options={[...WORK_SHIFT]}
                error={errors.workShift?.message}
              /> */}
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
            className="bg-orange-500 hover:bg-orange-700 font-bold "
          >
            CONTINUE
          </Button>
        </div>
      </form>
    </div>
  );
}
