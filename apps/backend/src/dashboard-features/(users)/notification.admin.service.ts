import type { UserRole } from "@repo/db";
import {
  notification,
  type notificationInsertSchema,
} from "@repo/db/dist/schema/user.schema";
import type { InferInsertModel } from "drizzle-orm";
import type z from "zod";

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

type NotificationInsert = z.infer<typeof notificationInsertSchema>;
export const expandInputDataOfNotification = (input: NotificationInsert) => {
  type FinalData = InferInsertModel<typeof notification>;
  type NotificationInsert = Omit<
    FinalData,
    "categoryId" | "subCategoryId" | "city" | "state"
  > & {
    categoryId: number | number[] | null;
    subCategoryId: number | number[] | null;
    city: number | number[] | null;
    state: number | number[] | null;
  };

  // Prepare data for insertion
  const data: NotificationInsert[] = [];

  const roles: UserRole[] =
    input.role.includes("all") || input.role.length === 0
      ? ["all"]
      : input.role;

  roles.forEach((role) => {
    data.push({ ...input, role });
  });

  const expandCategory: NotificationInsert[] = data.flatMap((item) => {
    if (Array.isArray(item.categoryId) && item.categoryId.length > 0) {
      return item.categoryId.map((id) => ({
        ...item,
        categoryId: id,
      }));
    }

    return [
      {
        ...item,
        categoryId: null,
      },
    ] as NotificationInsert[];
  });

  const expandSubCategory: NotificationInsert[] = expandCategory.flatMap(
    (item) => {
      if (Array.isArray(item.subCategoryId) && item.subCategoryId.length > 0) {
        return item.subCategoryId.map((id) => ({
          ...item,
          subCategoryId: id,
        }));
      }

      return [
        {
          ...item,
          subCategoryId: null,
        },
      ] as NotificationInsert[];
    },
  );

  const expandState: NotificationInsert[] = expandSubCategory.flatMap(
    (item) => {
      if (Array.isArray(item.state) && item.state.length > 0) {
        return item.state.map((id) => ({
          ...item,
          state: id,
        }));
      }

      return [
        {
          ...item,
          state: null,
        },
      ] as NotificationInsert[];
    },
  );

  const expandCity: FinalData[] = expandState.flatMap((item) => {
    if (Array.isArray(item.city) && item.city.length > 0) {
      return item.city.map((id) => ({
        ...item,
        city: id,
      })) as FinalData[];
    }

    return [
      {
        ...item,
        city: null,
      },
    ] as FinalData[];
  });

  return expandCity;
};
