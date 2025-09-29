import React from "react";
import { type Control, type FieldValues, useForm } from "react-hook-form";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function PreferredPositionForm() {
  const { control } = useForm<FieldValues>();

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <form className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
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
                options={[
                  { label: "Full Time", value: "Full Time" },
                  { label: "Part Time", value: "Part Time" },
                ]}
              />
              <FormField
                type=""
                control={control}
                label="Location Preferred"
                name="locationPreferred"
                placeholder="Enter location"
                component="input"
                required={false}
              />
              <FormField
                type=""
                control={control}
                label="Relocate"
                name="relocate"
                component="select"
                options={[
                  { label: "Yes", value: "Yes" },
                  { label: "No", value: "No" },
                ]}
                required={false}
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
                  />
                  <FormField
                    type=""
                    control={control}
                    label="To"
                    name="expectedSalaryTo"
                    placeholder="e.g. 50000"
                    component="input"
                    required={false}
                  />
                </div>
              </div>
              <FormField
                type=""
                control={control}
                label="Job Duration"
                name="jobDuration"
                component="checkbox"
                options={[
                  { label: "Day", value: "Day" },
                  { label: "Week", value: "Week" },
                  { label: "Month", value: "Month" },
                  { label: "Year", value: "Year" },
                  { label: "Few Years", value: "Few Years" },
                ]}
                required={false}
              />
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-1 gap-8">
              <div className="flex flex-col space-y-4">
                <h3 className="text-base font-medium text-gray-700">
                  Perffered Working Hours
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <FormField
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
                options={[
                  { label: "Morning Shift", value: "Morning Shift" },
                  { label: "Evening Shift", value: "Evening Shift" },
                  { label: "Night Shift", value: "Night Shift" },
                ]}
              />
              <FormField
                type=""
                control={control}
                label="Availability for Interview?"
                name="availability"
                placeholder="Availability"
                component="input"
                required={false}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 gap-4 bg-gray-50">
          <Button
            type="button"
            variant="outline"
            className="px-6 py-2 rounded-lg"
          >
            PREVIOUS
          </Button>
          <Button
            type="button"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg"
          >
            CONTINUE
          </Button>
        </div>
      </form>
    </div>
  );
}
