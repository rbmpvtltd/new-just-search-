import { users } from "@repo/db/dist/schema/auth.schema";

export const usersColumns = {
  id: users.id,
  displayName: users.displayName,
  status: users.status,
  role: users.role,
};

export const usersGlobalFilterColumns = [
  users.displayName,
  users.phoneNumber,
  users.email,
];
export const usersAllowedSortColumns = [
  // "display_name",
  // "id",
  // "email",
  "role",
  // "status",
];
