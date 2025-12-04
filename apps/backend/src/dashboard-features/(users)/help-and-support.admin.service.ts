import { notification } from "@repo/db/dist/schema/user.schema";

export const notificationColumns = {
  id: notification.id,
  title: notification.title,
  description: notification.description,
  role: notification.role,
  state: notification.state,
  city: notification.city,
  categoryId: notification.categoryId,
  subCategoryId: notification.subCategoryId,
  created_at: notification.createdAt,
};

export const notificationGlobalFilterColumns = [
  notification.title,
  notification.description,
];
export const notificationAllowedSortColumns = [
  "id",
  "title",
  "description",
  "role",
  "state",
  "city",
  "category_id",
  "sub_category_id",
  "created_at",
];
