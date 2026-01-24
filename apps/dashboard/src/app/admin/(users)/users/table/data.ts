import {
  Briefcase,
  Circle,
  HelpCircle,
  User,
  UserCheck,
  UserPlus,
} from "lucide-react";

export const active = [
  {
    value: "1",
    label: "Yes",
    icon: HelpCircle,
  },
  {
    value: "0",
    label: "No",
    icon: Circle,
  },
];

export const type = [
  {
    label: "Guest",
    value: "1",
    icon: User,
  },
  {
    label: "Visitor",
    value: "2",
    icon: UserCheck,
  },
  {
    label: "Business",
    value: "3",
    icon: Briefcase,
  },
  {
    label: "Hire",
    value: "4",
    icon: UserPlus,
  },
];
