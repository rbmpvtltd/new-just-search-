import { db } from "@repo/db";
import { plans } from "@repo/db/dist/schema/plan.schema";
import dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { users } from "../db/src/schema/auth.schema";
import { sql } from "./mysqldb.seed";

dotenv.config();

export const planSeed = async () => {
  await clearAllTablesBusiness();
  await addplans();
  // await addtransactions();
  // await addUserSubscriptions();
};

export const clearAllTablesBusiness = async () => {
  // await db.execute(`TRUNCATE  TABLE transactions RESTART IDENTITY CASCADE;`);
  // await db.execute(`TRUNCATE TABLE plan_attributes RESTART IDENTITY CASCADE;`);
  await db.execute(`TRUNCATE TABLE plans RESTART IDENTITY CASCADE;`);

  console.log(" All tables cleared successfully!");
};

// 1. Plans
const addplans = async () => {
  const plansData = [
    {
      name: "PRO",
      identifier: "plan_Rrrr2lJOWGFSLn",
      period: "yearly" as const,
      interval: 1,
      role: "business" as const,
      amount: 999,
      currency: "INR",
      planColor: "#ffbd59",
      features: {
        verifyBag: true,
        offerLimit: 50,
        productLimit: 20,
        offerDuration: 10,
        maxOfferPerDay: 7,
      },
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "FREE",
      identifier: "",
      period: "yearly" as const,
      interval: 1,
      role: "visiter" as const,
      amount: 0,
      currency: "INR",
      planColor: "#ff3131",
      features: {
        verifyBag: true,
        offerLimit: 0,
        productLimit: 0,
        offerDuration: 0,
        maxOfferPerDay: 0,
      },
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await db.insert(plans).values(plansData);
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
