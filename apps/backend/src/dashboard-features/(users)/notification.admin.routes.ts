// features/banners/banners.admin.routes.ts
import { db, type UserRole } from "@repo/db";
import {
  categories,
  cities,
  states,
  subcategories,
} from "@repo/db/dist/schema/not-related.schema";
import {
  notification,
  notificationInsertSchema,
} from "@repo/db/dist/schema/user.schema";
import { desc, eq, inArray, sql } from "drizzle-orm";
import z from "zod";
import {
  buildOrderByClause,
  buildWhereClause,
  tableInputSchema,
} from "@/lib/tableUtils";
import { adminProcedure, router } from "@/utils/trpc";
import {
  expandInputDataOfNotification,
  notificationAllowedSortColumns,
  notificationColumns,
  notificationGlobalFilterColumns,
} from "./notification.admin.service";

export const adminNotificationRouter = router({
  list: adminProcedure.input(tableInputSchema).query(async ({ input }) => {
    const where = buildWhereClause(
      input.filters,
      input.globalFilter,
      notificationColumns,
      notificationGlobalFilterColumns,
    );

    const orderBy = buildOrderByClause(
      input.sorting,
      notificationAllowedSortColumns,
      sql`created_at DESC`,
    );

    const offset = input.pagination.pageIndex * input.pagination.pageSize;

    const data = await db
      .select({
        // id: sql`min(${notification.id})`.as("id"),
        notificationId: notification.notificationId,
        title: notification.title,
        description: notification.description,
        status: notification.status,
        created_at: notification.createdAt,
        role: sql<string>`string_agg(DISTINCT ${notification.role}::text, ', ' ORDER BY ${notification.role}::text)`.as(
          "role",
        ),
        category: sql<
          string | null
        >`string_agg(DISTINCT ${categories.title}, ', ' ORDER BY ${categories.title})`.as(
          "category",
        ),
        subcategories: sql<
          string | null
        >`string_agg(DISTINCT ${subcategories.name}, ', ' ORDER BY ${subcategories.name})`.as(
          "subcategory",
        ),
        states: sql<
          string | null
        >`string_agg(DISTINCT ${states.name}, ', ' ORDER BY ${states.name})`.as(
          "state",
        ),
        cities: sql<
          string | null
        >`string_agg(DISTINCT ${cities.city}, ', ' ORDER BY ${cities.city})`.as(
          "cities",
        ),
      })
      .from(notification)
      .leftJoin(categories, eq(notification.categoryId, categories.id))
      .leftJoin(subcategories, eq(notification.subCategoryId, subcategories.id))
      .leftJoin(states, eq(notification.state, states.id))
      .leftJoin(cities, eq(notification.city, cities.id))
      .where(where)
      .orderBy(orderBy)
      .groupBy(
        notification.notificationId,
        notification.title,
        notification.description,
        notification.status,
        notification.createdAt,
      )
      .limit(input.pagination.pageSize)
      .offset(offset);

    const totalResult = await db
      .select({
        count: sql<number>`count(distinct ${notification.id})::int`,
      })
      .from(notification)
      // .leftJoin(categories, eq(subcategories.categoryId, categories.id))
      .where(where)
      .groupBy(notification.notificationId);

    const total = totalResult[0]?.count ?? 0;
    const totalPages = Math.ceil(total / input.pagination.pageSize);

    return {
      data,
      totalCount: total,
      totalPages,
      pageCount: totalPages,
    };
  }),
  add: adminProcedure.query(async () => {
    const lastNotificationId = (
      await db
        .select({
          notification_id: notification.notificationId,
        })
        .from(notification)
        .orderBy(desc(notification.notificationId))
        .limit(1)
    )[0]?.notification_id;
    const newNotificationId = Number(lastNotificationId ?? 0) + 1;

    const category = await db
      .select({
        id: categories.id,
        name: categories.title,
      })
      .from(categories);

    const state = await db
      .select({
        id: states.id,
        name: states.name,
      })
      .from(states);

    return { newNotificationId, category, state };
  }),

  subcategory: adminProcedure
    .input(z.array(z.number()))
    .query(async ({ input }) => {
      const subcategory = await db
        .select({
          id: subcategories.id,
          name: subcategories.name,
        })
        .from(subcategories)
        .where(inArray(subcategories.categoryId, input));
      return subcategory;
    }),

  city: adminProcedure.input(z.array(z.number())).query(async ({ input }) => {
    const city = await db
      .select({
        id: cities.id,
        name: cities.city,
      })
      .from(cities)
      .where(inArray(cities.stateId, input));
    return city;
  }),

  create: adminProcedure
    .input(notificationInsertSchema)
    .mutation(async ({ input }) => {
      const data = expandInputDataOfNotification(input);
      await db.insert(notification).values(data);

      return { success: true };
    }),
  edit: adminProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const lastData = (
        await db
          .select({
            // id: sql`min(${notification.id})`.as("id"),
            notificationId: notification.notificationId,
            title: notification.title,
            description: notification.description,
            status: notification.status,
            created_at: notification.createdAt,
            role: sql<
              UserRole[]
            >`ARRAY_AGG(DISTINCT ${notification.role}::text ORDER BY ${notification.role}::text)`.as(
              "role",
            ),
            category: sql<
              number[]
            >`ARRAY_AGG(DISTINCT ${notification.categoryId} ORDER BY ${notification.categoryId})`.as(
              "category",
            ),
            subcategories: sql<
              number[]
            >`ARRAY_AGG(DISTINCT ${notification.subCategoryId} ORDER BY ${notification.subCategoryId})`.as(
              "subcategory",
            ),
            states: sql<
              number[]
            >`ARRAY_AGG(DISTINCT ${notification.state} ORDER BY ${notification.state})`.as(
              "state",
            ),
            cities: sql<
              number[]
            >`ARRAY_AGG(DISTINCT ${notification.city} ORDER BY ${notification.city})`.as(
              "cities",
            ),
          })
          .from(notification)
          .where(eq(notification.notificationId, input.id))
          .groupBy(
            notification.notificationId,
            notification.title,
            notification.description,
            notification.status,
            notification.createdAt,
          )
      )[0];

      const category = await db
        .select({
          id: categories.id,
          name: categories.title,
        })
        .from(categories);

      const state = await db
        .select({
          id: states.id,
          name: states.name,
        })
        .from(states);

      return { lastData, category, state };
    }),
  update: adminProcedure
    .input(notificationInsertSchema)
    .mutation(async ({ input }) => {
      await db
        .delete(notification)
        .where(eq(notification.notificationId, Number(input.notificationId)));
      const data = expandInputDataOfNotification(input);
      await db.insert(notification).values(data);
      return { success: true };
    }),
  multidelete: adminProcedure
    .input(
      z.object({
        ids: z.array(z.number()),
      }),
    )
    .mutation(async ({ input }) => {
      await db
        .delete(notification)
        .where(inArray(notification.notificationId, input.ids));
      return { success: true };
    }),
  multiactive: adminProcedure
    .input(
      z.array(
        z.object({
          id: z.number(),
          isActive: z.boolean(),
        }),
      ),
    )
    .mutation(async ({ input }) => {
      await db
        .update(notification)
        .set({
          status: sql`CASE ${notification.notificationId} 
            ${sql.join(
              input.map(
                (item) =>
                  sql`WHEN ${item.id} THEN ${item.isActive ? sql`true` : sql`false`}`,
              ),
              sql` `,
            )}
                ELSE ${notification.status} 
                END`,
        })
        .where(
          inArray(
            notification.notificationId,
            input.map((item) => item.id),
          ),
        );

      return { success: true };
    }),
  multipopular: adminProcedure
    .input(
      z.array(
        z.object({
          id: z.number(),
          isActive: z.boolean(),
        }),
      ),
    )
    .mutation(async ({ input }) => {
      await db
        .update(categories)
        .set({
          isPopular: sql`CASE ${categories.id} 
            ${sql.join(
              input.map(
                (item) =>
                  sql`WHEN ${item.id} THEN ${item.isActive ? sql`true` : sql`false`}`,
              ),
              sql` `,
            )} 
                ELSE ${categories.isPopular} 
                END`,
        })
        .where(
          inArray(
            categories.id,
            input.map((item) => item.id),
          ),
        );

      return { success: true };
    }),
});
