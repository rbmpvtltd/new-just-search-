import { users } from "@repo/db/src/schema/auth.schema";
import { account_delete_request } from "@repo/db/src/schema/user.schema";

export const deleteRequestColumns = {
  id: account_delete_request.id,
  user_id: account_delete_request.userId,
  display_name: users.displayName,
  phone: users.phoneNumber,
  reason: account_delete_request.reason,
  created_at: account_delete_request.createdAt,
};

export const deleteRequestGlobalFilterColumns = [
  users.displayName,
  users.id,
  users.phoneNumber,
  account_delete_request.reason,
];
export const deleteRequestAllowedSortColumns = [
  "id",
  "user_id",
  "display_name",
  "phone_number",
  "reason",
  "created_at",
];
