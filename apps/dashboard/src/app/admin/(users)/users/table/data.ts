import {
  Briefcase,
  Circle,
  HelpCircle,
  Store,
  User,
  UserCheck,
  UserPlus,
  UserSearch,
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
    value: "guest",
    icon: User,
  },
  {
    label: "Visitor",
    value: "visitor",
    icon: UserCheck,
  },
  {
    label: "Business",
    value: "business",
    icon: Briefcase,
  },
  {
    label: "Hire",
    value: "hire",
    icon: UserPlus,
  },
  {
    label: "Salesman",
    value: "salesman",
    icon: UserSearch,
  },
  {
    label: "Franchise",
    value: "franchises",
    icon: Store,
  },
];
