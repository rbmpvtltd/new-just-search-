import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import z from "zod";
import {
  categories,
  cities,
  subcategories,
} from "../schema/not-related.schema";
import { users } from "./auth.schema";

// ✅ Enums
export const Gender = {
  Male: "Male",
  Female: "Female",
  Others: "Others",
} as const;

export const MaritalStatus = {
  Married: "Married",
  Unmarried: "Unmarried",
  Widowed: "Widowed",
  Divorced: "Divorced",
  Others: "Others",
} as const;

export const JobType = {
  FullTime: "FullTime",
  PartTime: "PartTime",
  Both: "Both",
} as const;

export const WorkShift = {
  Morning: "Morning",
  Evening: "Evening",
  Night: "Night",
} as const;

export const JobDuration = {
  Day: "Day",
  Week: "Week",
  Month: "Month",
  Year: "Year",
} as const;

// export const Languages = {
//   Hindi: "Hindi",
//   English: "English",
//   Punjabi: "Punjabi",
//   Gujarati: "Gujarati",
//   Bengali: "Bengali",
//   Malayalam: "Malayalam",
//   Kannada: "Kannada",
//   Tamil: "Tamil",
//   Other: "Other",
// } as const;

export const genderEnum = pgEnum("hire_gender", Gender);
export const maritalStatusEnum = pgEnum("hire_marital_status", MaritalStatus);

export const jobTypeEnum = pgEnum("hire_job_type", JobType);
export const workShiftEnum = pgEnum("hire_work_shift", WorkShift);
export const jobDurationEnum = pgEnum("hire_job_duration", JobDuration);
// export const languagesEnum = pgEnum("hire_languages", Languages);

export const hireListing = pgTable("hire_listing", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  fatherName: varchar("father_name", { length: 255 }),
  dob: date("dob"),
  gender: genderEnum("gender").notNull(),
  maritalStatus: maritalStatusEnum("marital_status").notNull(),
  languages: varchar("language", { length: 255 }).array().notNull(),
  slug: varchar("slug", { length: 255 }),
  specialities: text("specialities"),
  description: text("description"),
  latitude: varchar("latitude", { length: 100 }),
  longitude: varchar("longitude", { length: 100 }),
  buildingName: varchar("building_name", { length: 255 }),
  streetName: varchar("street_name", { length: 255 }),
  area: varchar("area", { length: 255 }),
  landmark: varchar("landmark", { length: 255 }),
  pincode: varchar("pincode"),
  state: integer("state"),
  city: integer("city")
    .notNull()
    .references(() => cities.id),
  schedules: text("schedules"),
  photo: varchar("photo", { length: 500 }),
  isFeature: boolean("is_feature").default(false).notNull(),
  status: boolean("status").default(true).notNull(),
  website: varchar("website", { length: 255 }),
  email: varchar("email", { length: 255 }),
  mobileNumber: varchar("mobile_number", { length: 20 }),
  whatsappNo: varchar("whatsapp_no", { length: 20 }),
  alternativeMobileNumber: varchar("alternative_mobile_number", { length: 20 }),
  facebook: varchar("facebook", { length: 255 }),
  twitter: varchar("twitter", { length: 255 }),
  linkedin: varchar("linkedin", { length: 255 }),
  views: integer("views").default(0),
  highestQualification: varchar("highest_qualification", {
    length: 255,
  }).notNull(),
  employmentStatus: varchar("employment_status", { length: 255 }),
  workExperienceYear: integer("work_experience_year"),
  workExperienceMonth: integer("work_experience_month"),
  jobRole: varchar("job_role", { length: 255 }),
  previousJobRole: varchar("previous_job_role", { length: 255 }),
  expertise: text("expertise"),
  skillset: text("skillset"),
  abilities: text("abilities"),
  jobType: jobTypeEnum("job_type").array().notNull(),
  jobDuration: jobDurationEnum("job_duration").array().notNull(),
  locationPreferred: varchar("location_preferred", { length: 255 }),
  certificates: text("certificates"),
  workShift: workShiftEnum("work_shift").array().notNull(),
  expectedSalaryFrom: varchar("expected_salary_from", { length: 100 }),
  expectedSalaryTo: varchar("expected_salary_to", { length: 100 }),
  preferredWorkingHours: varchar("preferred_working_hours", { length: 100 }),
  relocate: varchar("relocate"),
  availability: varchar("availability", { length: 255 }),
  idProof: varchar("id_proof").notNull(),
  idProofPhoto: varchar("id_proof_photo", { length: 500 }),
  coverLetter: varchar("resume", { length: 500 }),
  resumePhoto: varchar("resume_photo", { length: 500 }),
  aboutYourself: text("about_yourself"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// export const hireInsertSchema = createInsertSchema(hireListing).extend({
//   gender: z.enum(Gender),
//   maritalStatus: z.enum(MaritalStatus),
//   categoryId: z.number(),
//   subcategoryId: z.array(z.number()),
// });
export const hireInsertSchema = createInsertSchema(hireListing, {
  photo: () => z.string().min(1, "Photo is required"),
  name: () => z.string().min(3, "Name should be minimum 3 characters long"),
  fatherName: () =>
    z.string().min(3, "Name should be minimum 3 characters long"),
  dob: () => z.string().min(1, "Date of birth is required"),
  mobileNumber: () =>
    z.string().min(10, "Mobile number should be minimum 10 characters long"),
  languages: () => z.array(z.string()).min(1, "Select at least one language"),
  latitude: () =>
    z.string().refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= -90 && num <= 90;
      },
      { message: "Latitude must be a number between -90 and 90" },
    ),
  longitude: () =>
    z.string().refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num >= -180 && num <= 180;
      },
      { message: "Longitude must be a number between -180 and 180" },
    ),
  area: () => z.string().min(3, "Area should be minimum 3 characters long"),
  pincode: () =>
    z.string().min(6, "Pincode should be minimum 6 characters long"),
  state: () => z.number().min(1, "State is required"),

  highestQualification: () =>
    z.string().min(1, "Highest qualification is required"),
  employmentStatus: () => z.string().min(1, "Employment status is required"),
  workExperienceYear: () =>
    z.number().min(1, "Work experience year is required"),
  jobRole: () => z.string().min(1, "Job role is required"),

  idProof: () => z.string().min(1, "ID proof is required"),
  city: () => z.number().min(1, "City is required"),
  jobType: () => z.array(z.enum(JobType)).min(1, "Job type is required"),
  workShift: () => z.array(z.enum(WorkShift)).min(1, "Work shift is required"),
}).extend({
  categoryId: z.number().min(1, "Category is required"),
  subcategoryId: z.array(z.number()).min(1, "Select at least one subcategory"),
  gender: z.enum(Gender, { message: "Gender is required" }),
  maritalStatus: z.enum(MaritalStatus, {
    message: "Marital status is required",
  }),
  // jobType: z.array(z.enum(JobType), { message: "Job type is required" }),
  jobDuration: z.array(z.enum(JobDuration)),
  // workShift: z.array(z.enum(WorkShift), { message: "Work shift is required" }),
});

export const hireUpdateSchema = createUpdateSchema(hireListing).extend({
  categoryId: z.number(),
  subcategoryId: z.array(z.number()),
  gender: z.enum(Gender),
  maritalStatus: z.enum(MaritalStatus),
  languages: z.array(z.string()),
  jobType: z.array(z.enum(JobType)),
  jobDuration: z.array(z.enum(JobDuration)),
  workShift: z.array(z.enum(WorkShift)),
});

export const personalDetailsHireSchema = hireInsertSchema.pick({
  photo: true,
  name: true,
  categoryId: true,
  subcategoryId: true,
  maritalStatus: true,
  gender: true,
  fatherName: true,
  dob: true,
  languages: true,
  mobileNumber: true,
  alternativeMobileNumber: true,
  email: true,
  latitude: true,
  longitude: true,
  area: true,
  pincode: true,
  state: true,
  city: true,
});
export const educationSchema = hireInsertSchema.pick({
  highestQualification: true,
  skillset: true,
  employmentStatus: true,
  workExperienceYear: true,
  workExperienceMonth: true,
  jobRole: true,
  previousJobRole: true,
  certificates: true,
});

export const preferredPositionSchema = hireInsertSchema.pick({
  jobType: true,
  locationPreferred: true,
  workShift: true,
  expectedSalaryFrom: true,
  expectedSalaryTo: true,
  preferredWorkingHours: true,
  jobDuration: true,
  relocate: true,
  availability: true,
});

export const documentSchema = hireInsertSchema.pick({
  idProof: true,
  idProofPhoto: true,
  coverLetter: true,
  resumePhoto: true,
  aboutYourself: true,
});

export const recentViewHire = pgTable("recent_view_hire", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  hireId: integer("hire_id")
    .references(() => hireListing.id)
    .notNull(),
  device: varchar("device", { length: 100 }),
  browser: varchar("browser", { length: 100 }),
  operatingSystem: varchar("operating_system", { length: 100 }),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// 3.HireSubcategory
export const hireSubcategories = pgTable("hire_subcategories", {
  id: serial("id").primaryKey(),
  hireId: integer("hire_id")
    .notNull()
    .references(() => hireListing.id, { onDelete: "cascade" }),

  subcategoryId: integer("subcategory_id")
    .notNull()
    .references(() => subcategories.id),
});

// 4.HireCategory
export const hireCategories = pgTable("hire_categories", {
  id: serial("id").primaryKey(),

  hireId: integer("hire_id")
    .notNull()
    .references(() => hireListing.id, { onDelete: "cascade" }),

  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),
});

// 5 hires_comments
// export const hireComments = pgTable("hire_comments", {
//   id: serial("id").primaryKey(),

//   hireId: integer("hire_id")
//     .notNull()
//     .references(() => hireListing.id),\
//   commentId: integer("comment_id")
//     .notNull()
//     .references(() => comments.id),
// });

// // 6.HireRefer
// interface IHireRefer extends Document {
//   hire_id: Types.ObjectId;
//   salesman_id: Types.ObjectId;
// }

// export const hireRefers = pgTable("hire_refers", {
//   id: serial("id").primaryKey(),
//   hireId: integer("hire_id")
//     .notNull()
//     .references(() => hireListing.id),
//   salesmanId: integer("salesman_id")
//     .notNull()
//     .references(() => salesmen.id),
// });
