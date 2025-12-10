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
import { useUserFormStore } from "../../../shared/store/useCreateHireStore";
import type { EditAdminHireType } from "..";

type PreferredPositionSchema = z.infer<typeof preferredPositionSchema>;
export default function PreferredPositionForm({
  data,
}: {
  data: EditAdminHireType;
}) {
  const setFormValue = useUserFormStore((state) => state.setFormValue);
  const prevPage = useUserFormStore((state) => state.prevPage);
  const nextPage = useUserFormStore((state) => state.nextPage);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PreferredPositionSchema>({
    resolver: zodResolver(preferredPositionSchema),
    defaultValues: {
      jobType: data?.hire?.jobType ?? [],
      locationPreferred: data?.hire?.locationPreferred ?? "",
      relocate: data?.hire?.relocate ?? undefined,
      expectedSalaryFrom: data?.hire?.expectedSalaryFrom ?? "",
      expectedSalaryTo: data?.hire?.expectedSalaryTo ?? "",
      jobDuration: data?.hire?.jobDuration ?? [],
      // fromHour: formValue.fromHour ?? undefined,
      // fromPeriod: formValue.fromPeriod ?? undefined,
      // toHour: formValue.toHour ?? undefined,
      // toPeriod: formValue.toPeriod ?? undefined,
      // preferredWorkingHours: data?.hire?.preferredWorkingHours ?? "",
      workShift: data?.hire?.workShift ?? [],
      availability: data?.hire?.availability ?? "",
    },
  });

  const onSubmit = (data: PreferredPositionSchema) => {
    setFormValue("jobType", data.jobType ?? "");
    setFormValue("locationPreferred", data.locationPreferred ?? "");
    setFormValue("relocate", data.relocate ?? undefined);
    setFormValue("expectedSalaryFrom", data.expectedSalaryFrom ?? "");
    setFormValue("expectedSalaryTo", data.expectedSalaryTo ?? "");
    setFormValue("jobDuration", data.jobDuration ?? "");
    // setFormValue("fromHour", data.fromHour ?? undefined);
    // setFormValue("fromPeriod", data.fromPeriod ?? undefined);
    // setFormValue("toHour", data.toHour ?? undefined);
    // setFormValue("toPeriod", data.toPeriod ?? undefined);
    // setFormValue("preferredWorkingHours", data.preferredWorkingHours ?? "");
    setFormValue("workShift", data.workShift ?? "");
    setFormValue("availability", data.availability ?? "");
    nextPage();
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
                  {/* <FormField
                        type=""
                        control={control}
                        label="From Hour"
                        name="fromHour"
                        component="select"
                        options={[
                          { label: "1", value: "1" },
                          { label: "2", value: "2" },
                          { label: "3", value: "3" },
                          { label: "4", value: "4" },
                          { label: "5", value: "5" },
                          { label: "6", value: "6" },
                          { label: "7", value: "7" },
                          { label: "8", value: "8" },
                          { label: "9", value: "9" },
                          { label: "10", value: "10" },
                          { label: "11", value: "11" },
                          { label: "12", value: "12" },
                        ]}
                        required={false}
                        error={errors.fromHour?.message}
                      />
                      <FormField
                        type=""
                        control={control}
                        label="From Period"
                        name="fromPeriod"
                        component="select"
                        options={[
                          { label: "AM", value: "AM" },
                          { label: "PM", value: "PM" },
                        ]}
                        required={false}
                        error={errors.fromPeriod?.message}
                      />
                      <FormField
                        type=""
                        control={control}
                        label="To Hour"
                        name="toHour"
                        component="select"
                        options={[
                          { label: "1", value: "1" },
                          { label: "2", value: "2" },
                          { label: "3", value: "3" },
                          { label: "4", value: "4" },
                          { label: "5", value: "5" },
                          { label: "6", value: "6" },
                          { label: "7", value: "7" },
                          { label: "8", value: "8" },
                          { label: "9", value: "9" },
                          { label: "10", value: "10" },
                          { label: "11", value: "11" },
                          { label: "12", value: "12" },
                        ]}
                        required={false}
                        error={errors.toHour?.message}
                      />
                      <FormField
                        type=""
                        control={control}
                        label="To Period"
                        name="toPeriod"
                        component="select"
                        options={[
                          { label: "AM", value: "AM" },
                          { label: "PM", value: "PM" },
                        ]}
                        required={false}
                        error={errors.toPeriod?.message}
                      /> */}
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
