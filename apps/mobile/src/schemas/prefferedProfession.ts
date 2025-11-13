// import { z } from "zod";

// export const prefferedProfessionSchema = z.object({
//   job_type: z.array(z.string()).min(1, {
//     message: "Please select at least one job type for which you are applying",
//   }),
//   location_preferred: z.string().optional(),
//   work_shift: z.array(z.string()),
//   expected_salary_from: z.string().optional(),
//   expected_salary_to: z.string().optional(),
//   job_duration: z.array(z.string().optional()),
//   relocate: z.number().optional(),
//   availability: z.string().optional(),

//   from_hour: z.string().min(1, "Select start time"),
//   from_period: z.enum(["AM", "PM"], {
//     required_error: "Select AM/PM",
//   }),

//   to_hour: z.string().min(1, "Select end time"),
//   to_period: z.enum(["AM", "PM"], {
//     required_error: "Select AM/PM",
//   }),
// });

// export type PrefferedProfessionType = z.infer<typeof prefferedProfessionSchema>;
