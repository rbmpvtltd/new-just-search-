import { db, type UserRole } from "@repo/db";
import { users } from "@repo/db/dist/schema/auth.schema";
import {
  businessCategories,
  businessListings,
  businessSubcategories,
} from "@repo/db/dist/schema/business.schema";
import {
  hireCategories,
  hireListing,
  hireSubcategories,
} from "@repo/db/dist/schema/hire.schema";
import { pushTokens } from "@repo/db/dist/schema/notification.schema";
import {
  notification,
  type notificationInsertSchema,
} from "@repo/db/dist/schema/user.schema";
import { and, eq, inArray, type InferInsertModel } from "drizzle-orm";
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

export interface NotificationCriteria {
  role: UserRole;
  categoryId: number | null;
  subCategoryId: number | null;
  state: number | null;
  city: number | null;
}

export const getUsersMatchingCriteria = async (
  criteria: NotificationCriteria,
) => {
  const { role, categoryId, subCategoryId, state, city } = criteria;

  console.log("Fetching users for criteria:", criteria);

  // Build conditions for user role
  const conditions = [];

  // Role condition - if 'all', get all users, otherwise filter by role
  if (role !== "all") {
    conditions.push(eq(users.role, role));
  }

  // For visitor and guest roles, category/location filters don't apply
  const isSimpleRole = role === "visiter" || role === "guest";

  if (isSimpleRole) {
    console.log(`Simple role (${role}) - fetching all users with this role`);

    // Just fetch users with their push tokens based on role
    const query = db
      .select({
        userId: users.id,
        userName: users.displayName,
        userEmail: users.email,
        userRole: users.role,
        pushToken: pushTokens.token,
        deviceId: pushTokens.deviceId,
        platform: pushTokens.platform,
      })
      .from(users)
      .leftJoin(pushTokens, eq(users.id, pushTokens.userId));

    if (conditions.length > 0) {
      return await query.where(and(...conditions));
    }
    return await query;
  }

  // For business and hire roles, apply category/location filters
  const needsFiltering = categoryId || subCategoryId || state || city;

  if (needsFiltering) {
    let userIds: number[] = [];

    // Handle business role
    if (role === "business" || role === "all") {
      console.log("Processing business role filters...");

      const businessConditions = [];

      // Build query starting from business_listings
      let businessQuery = db
        .selectDistinct({ userId: businessListings.userId })
        .from(businessListings);

      // Join with business_categories if categoryId filter exists
      if (categoryId) {
        console.log("Filtering by categoryId:", categoryId);
        businessQuery = businessQuery.innerJoin(
          businessCategories,
          eq(businessListings.id, businessCategories.businessId),
        ) as any;
        businessConditions.push(eq(businessCategories.categoryId, categoryId));
      }

      // Join with business_subcategories if subCategoryId filter exists
      if (subCategoryId) {
        console.log("Filtering by subCategoryId:", subCategoryId);
        businessQuery = businessQuery.innerJoin(
          businessSubcategories,
          eq(businessListings.id, businessSubcategories.businessId),
        ) as any;
        businessConditions.push(
          eq(businessSubcategories.subcategoryId, subCategoryId),
        );
      }

      // Location filtering from business_listings
      if (state) {
        console.log("Filtering by state:", state);
        businessConditions.push(eq(businessListings.state, state));
      }
      if (city) {
        console.log("Filtering by city:", city);
        businessConditions.push(eq(businessListings.city, city));
      }

      // Apply all business conditions
      if (businessConditions.length > 0) {
        const usersWithBusinesses = await (businessQuery as any).where(
          and(...businessConditions),
        );
        const businessUserIds = usersWithBusinesses.map((u: any) => u.userId);
        console.log(
          `Found ${businessUserIds.length} business users matching criteria`,
        );
        userIds.push(...businessUserIds);
      } else if (role === "business") {
        // If business role but no filters, get all business listings users
        const allBusinessUsers = await db
          .selectDistinct({ userId: businessListings.userId })
          .from(businessListings);
        userIds.push(...allBusinessUsers.map((u) => u.userId));
      }
    }

    // Handle hire role
    if (role === "hire" || role === "all") {
      console.log("Processing hire role filters...");

      const hireConditions = [];

      // Build query starting from hire_listing
      let hireQuery = db
        .selectDistinct({ userId: hireListing.userId })
        .from(hireListing);

      // Join with hire_categories if categoryId filter exists
      if (categoryId) {
        console.log("Filtering hire by categoryId:", categoryId);
        hireQuery = hireQuery.innerJoin(
          hireCategories,
          eq(hireListing.id, hireCategories.hireId),
        ) as any;
        hireConditions.push(eq(hireCategories.categoryId, categoryId));
      }

      // Join with hire_subcategories if subCategoryId filter exists
      if (subCategoryId) {
        console.log("Filtering hire by subCategoryId:", subCategoryId);
        hireQuery = hireQuery.innerJoin(
          hireSubcategories,
          eq(hireListing.id, hireSubcategories.hireId),
        ) as any;
        hireConditions.push(eq(hireSubcategories.subcategoryId, subCategoryId));
      }

      // Location filtering from hire_listing
      if (state) {
        console.log("Filtering hire by state:", state);
        hireConditions.push(eq(hireListing.state, state));
      }
      if (city) {
        console.log("Filtering hire by city:", city);
        hireConditions.push(eq(hireListing.city, city));
      }

      // Apply all hire conditions
      if (hireConditions.length > 0) {
        const usersWithHire = await (hireQuery as any).where(
          and(...hireConditions),
        );
        const hireUserIds = usersWithHire.map((u: any) => u.userId);
        console.log(`Found ${hireUserIds.length} hire users matching criteria`);
        userIds.push(...hireUserIds);
      } else if (role === "hire") {
        // If hire role but no filters, get all hire listings users
        const allHireUsers = await db
          .selectDistinct({ userId: hireListing.userId })
          .from(hireListing);
        userIds.push(...allHireUsers.map((u) => u.userId));
      }
    }

    // Remove duplicates
    userIds = [...new Set(userIds)];
    console.log(`Total unique user IDs after filtering: ${userIds.length}`);

    if (userIds.length > 0) {
      conditions.push(inArray(users.id, userIds));
    } else {
      // No matching users found
      console.log("No users found matching criteria");
      return [];
    }
  } else if (role === "business" || role === "hire") {
    // If business/hire role but no category/location filters, get all users with listings
    console.log(
      `No filters for ${role} role - fetching all users with listings`,
    );

    if (role === "business") {
      const allBusinessUsers = await db
        .selectDistinct({ userId: businessListings.userId })
        .from(businessListings);
      const userIds = allBusinessUsers.map((u) => u.userId);
      if (userIds.length > 0) {
        conditions.push(inArray(users.id, userIds));
      } else {
        return [];
      }
    } else if (role === "hire") {
      const allHireUsers = await db
        .selectDistinct({ userId: hireListing.userId })
        .from(hireListing);
      const userIds = allHireUsers.map((u) => u.userId);
      if (userIds.length > 0) {
        conditions.push(inArray(users.id, userIds));
      } else {
        return [];
      }
    }
  }

  // Fetch users with their push tokens
  console.log("Fetching users with push tokens...");
  const query = db
    .select({
      userId: users.id,
      userName: users.displayName,
      userEmail: users.email,
      userRole: users.role,
      pushToken: pushTokens.token,
      deviceId: pushTokens.deviceId,
      platform: pushTokens.platform,
    })
    .from(users)
    .leftJoin(pushTokens, eq(users.id, pushTokens.userId));

  if (conditions.length > 0) {
    const result = await query.where(and(...conditions));
    console.log(`Fetched ${result.length} user-token combinations`);
    return result;
  }

  const result = await query;
  console.log(
    `Fetched ${result.length} user-token combinations (no conditions)`,
  );
  return result;
};
