import dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { db } from "@/config/dbConnections";
import { users } from "@/features/auth/auth.model";
import {
  planAttributes,
  plans1,
  transactions,
  userSubscriptions,
} from "@/features/plan/plan.model";
import { sql } from "./mysqldb";

dotenv.config();

export const planSeed = async () => {
  await clearAllTablesBusiness();
  // await addplans();
  await addtransactions();
  await addUserSubscriptions();
};

export const clearAllTablesBusiness = async () => {
  await db.execute(`TRUNCATE  TABLE transactions RESTART IDENTITY CASCADE;`);
  // await db.execute(`TRUNCATE TABLE plan_attributes RESTART IDENTITY CASCADE;`);
  // await db.execute(`TRUNCATE TABLE plans RESTART IDENTITY CASCADE;`);

  console.log(" All tables cleared successfully!");
};

// 1. Plans
const addplans = async () => {
  const [plans]: any[] = await sql.execute("SELECT * FROM plans");
  for (const row of plans) {
    await db.insert(plans1).values({
      id: row.id,
      title: row.title,
      subtitle: row.subtitle,
      planType: row.plan_type,
      price: row.price,
      prevPrice: row.prev_price,
      priceColor: row.price_color,
      postLimit: row.post_limit,
      productLimit: row.product_limit,
      offerLimit: row.offer_limit,
      postDuration: row.post_duration,
      offerDuration: row.offer_duration,
      maxOfferPerDay: row.max_offer_per_day,
      status: Boolean(row.status),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });

    // 2. PlanAttribute
    await db.insert(planAttributes).values({
      planId: row.id,
      name: [row.attribute],
      isAvailable: Boolean(row.isAvailable),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
  console.log("successfully seed of plans and planAttributes ");
};

// 3. transactions
const addtransactions = async () => {
  const [transaction]: any[] = await sql.execute("SELECT * FROM transactions");

  for (const row of transaction) {
    await db.insert(transactions).values({
      id: row.id,
      amount: row.amount,
      transactionsNo: row.txnid,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
  console.log("successfully seed of transaction");
};

// 4. user_subscriptions
const addUserSubscriptions = async () => {
  const [subscriptions]: any[] = await sql.execute(
    "SELECT * FROM user_subscriptions ",
  );
  for (const row of subscriptions) {
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.transactionsNo, row.txnid));

    if (!transaction) {
      console.log("transaction not found", row.id);
      continue;
    }

    const [plan] = await db
      .select()
      .from(plans1)
      .where(eq(plans1.id, row.plan_id));
    if (!plan) {
      console.log("plan not found", row.id);
      continue;
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, row.user_id));
    if (!user) {
      console.log("user not found", row.id);
      continue;
    }
    await db.insert(userSubscriptions).values({
      id: row.id,
      userId: user.id,
      subscriptionNumber: row.user_subscriptions,
      transactionId: transaction.id,
      price: row.price,
      plansId: plan.id,
      expiryDate: row.days,
      status: Boolean(row.status),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
};
