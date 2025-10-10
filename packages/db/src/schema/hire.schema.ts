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
  Others: "Others", // TODO : add unknown field
} as const;

export const JobType = {
  FullTime: "FullTime",
  PartTime: "PartTime",
  Both: "Both",
};

export const WorkShift = {
  Morning: "Morning",
  Evening: "Evening",
  Night: "Night",
};

export const JobDuration = {
  Day: "Day",
  Week: "Week",
  Month: "Month",
  Year: "Year",
  "Few Years": "Few Years",
};

export const YesNoOption = {
  Yes: "Yes",
  No: "No",
};

export const IdProof = {
  AadharCard: "AadharCard",
  PanCard: "PanCard",
  VoterCard: "VoterCard",
  DrivingLicense: "DrivingLicense",
  Others: "Others",
};

export const Languages = {
  Hindi: "Hindi",
  English: "English",
  Punjabi: "Punjabi",
  Gujarati: "Gujarati",
  Bengali: "Bengali",
  Malayalam: "Malayalam",
  Kannada: "Kannada",
  Tamil: "Tamil",
  Other: "Other",
};

export const genderEnum = pgEnum("hire_gender", Gender);
export const maritalStatusEnum = pgEnum("hire_marital_status", MaritalStatus);

export const jobTypeEnum = pgEnum("hire_job_type", JobType);
export const workShiftEnum = pgEnum("hire_work_shift", WorkShift);
export const jobDurationEnum = pgEnum("hire_job_duration", JobDuration);
export const relocateEnum = pgEnum("hire_relocate", YesNoOption);
export const idProofEnum = pgEnum("hire_id_proof", IdProof);
export const languagesEnum = pgEnum("hire_languages", Languages);

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
  languages: languagesEnum("languages").array().notNull(),
  slug: varchar("slug", { length: 255 }),
  specialities: text("specialities"),
  description: text("description"),
  latitude: varchar("latitude", { length: 100 }),
  longitude: varchar("longitude", { length: 100 }),
  buildingName: varchar("building_name", { length: 255 }),
  streetName: varchar("street_name", { length: 255 }),
  area: varchar("area", { length: 255 }),
  landmark: varchar("landmark", { length: 255 }),
  pincode: integer("pincode"),
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
  locationPreferred: varchar("location_preferred", { length: 255 }),
  certificates: text("certificates"),
  workShift: workShiftEnum("work_shift").array().notNull(),
  expectedSalaryFrom: varchar("expected_salary_from", { length: 100 }),
  expectedSalaryTo: varchar("expected_salary_to", { length: 100 }),
  preferredWorkingHours: varchar("preferred_working_hours", { length: 100 }),
  jobDuration: jobDurationEnum("job_duration").array().notNull(),
  relocate: relocateEnum("relocate"),
  availability: varchar("availability", { length: 255 }),
  idProof: idProofEnum("id_proof"),
  idProofPhoto: varchar("id_proof_photo", { length: 500 }),
  coverLetter: varchar("resume", { length: 500 }),
  resumePhoto: varchar("resume_photo", { length: 500 }),
  aboutYourself: text("about_yourself"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// // 2. recent_views_hire
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
    .references(() => hireListing.id),

  subcategoryId: integer("subcategory_id")
    .notNull()
    .references(() => subcategories.id),
});

// 4.HireCategory
export const hireCategories = pgTable("hire_categories", {
  id: serial("id").primaryKey(),

  hireId: integer("hire_id")
    .notNull()
    .references(() => hireListing.id),

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
