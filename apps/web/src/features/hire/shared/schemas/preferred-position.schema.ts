import z from "zod";
// import {
//   HOURS,
//   JOB_DURATION,
//   JOB_TYPE,
//   PERIOD,
//   WORK_SHIFT,
//   YES_NO_OPTIONS,
// } from "../constants/hire";

// const relocateValue = YES_NO_OPTIONS.map((relocate) => relocate.value);
// const jobDurationValue = JOB_DURATION.map((jobDuration) => jobDuration.value);
// const hourValue = HOURS.map((hour) => hour.value);
// const periodValue = PERIOD.map((period) => period.value);
// const workShiftValue = WORK_SHIFT.map((workShift) => workShift.value);

// const jobTypeValue = JOB_TYPE.map((jobType) => jobType.value);
export const preferredPositionSchema = z.object({
  // jobType: z.array(z.enum(jobTypeValue)).min(1, {
  //   message: "Please select at least one job type",
  // }),
  // locationPreferred: z.string().optional(),
  // relocate: z.enum(relocateValue).optional(),
  // expectedSalaryFrom: z.string().optional(),
  // expectedSalaryTo: z.string().optional(),
  // jobDuration: z.array(z.enum(jobDurationValue)).optional(),
  // fromHour: z.enum(hourValue).optional(),
  // fromPeriod: z.enum(periodValue).optional(),
  // toHour: z.enum(hourValue).optional(),
  // toPeriod: z.enum(periodValue).optional(),
  // workShift: z.array(z.enum(workShiftValue)).min(1, {
  //   message: "Please select at least one work shift",
  // }),
  availability: z.string(),
});

export type PreferredPosition = z.infer<typeof preferredPositionSchema>;
