import { pgEnum } from "drizzle-orm/pg-core";

export const UserRole = {
  guest: "guest",
  visiter: "visiter",
  hire: "hire",
  business: "business",
  salesman: "salesman",
  franchises: "franchises",
  admin: "admin",
  all: "all",
} as const;

export const userRoleEnum = pgEnum("user_role", UserRole);
export const notificationRoleEnum = pgEnum("notification_enum", UserRole);

export const MaritalStatus = {
  Married: "Married",
  Unmarried: "Unmarried",
  Widowed: "Widowed",
  Divorced: "Divorced",
  Others: "Others",
} as const;

export const maritalStatusEnum = pgEnum("marital_status", MaritalStatus);

export const Gender = {
  Male: "Male",
  Female: "Female",
  Others: "Others",
} as const;

export const genderEnum = pgEnum("gender", Gender);

export const JobType = {
  FullTime: "FullTime",
  PartTime: "PartTime",
  Both: "Both",
} as const;

export const jobTypeEnum = pgEnum("job_type", JobType);

export const WorkShift = {
  Morning: "Morning",
  Evening: "Evening",
  Night: "Night",
} as const;

export const workShiftEnum = pgEnum("work_shift", WorkShift);

export const JobDuration = {
  Day: "Day",
  Week: "Week",
  Month: "Month",
  Year: "Year",
} as const;

export const jobDurationEnum = pgEnum("job_duration", JobDuration);

export const Status = {
  Pending: "Pending",
  Approved: "Approved",
  Rejected: "Rejected",
} as const;

export const statusEnum = pgEnum("status", Status);

export const SendByRole = {
  Admin: "Admin",
  User: "User",
} as const;
export const sendByRoleEnum = pgEnum("send_by_role", SendByRole);

// Plan

export const PlanPeriod = {
  daily: "daily",
  weekly: "weekly",
  monthly: "monthly",
  yearly: "yearly",
} as const;

export const planPeriodEnum = pgEnum("plan_period", PlanPeriod);

// export const languagesEnum = pgEnum("hire_languages", Languages);
