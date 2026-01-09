import { db } from "@repo/db";
import { planAttributes, plans } from "@repo/db/dist/schema/plan.schema";
import type { InferInsertModel } from "drizzle-orm";

export const planSeed = async () => {
  await clearAllTablesBusiness();
  await addplans();
  await planAttribute();
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
  type PlanData = InferInsertModel<typeof plans>;
  const plansData: PlanData[] = [
    {
      id: 1,
      name: "FREE",
      razorPayIdentifier: "",
      period: "yearly" as const,
      interval: 1,
      role: "all",
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
    {
      id: 2,
      name: "PRO",
      razorPayIdentifier: "plan_Rrrr2lJOWGFSLn",
      period: "yearly",
      interval: 1,
      role: "business",
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
      id: 3,
      name: "ULTRA",
      razorPayIdentifier: "ultra_plan_Rrrr2lJOWGFSLn",
      period: "yearly",
      interval: 1,
      role: "business",
      amount: 2999,
      currency: "INR",
      planColor: "#7ed957",
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
      id: 4,
      name: "HIRE",
      razorPayIdentifier: "hire_plan_Rrrr2lJOWGFSLn",
      period: "yearly",
      interval: 1,
      role: "hire",
      amount: 399,
      currency: "INR",
      planColor: "#38b6ff",
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
const planAttribute = async () => {
  type PlanAttributesData = InferInsertModel<typeof planAttributes>;
  const planAttributesData: PlanAttributesData[] = [
    {
      planId: 1,
      name: "BUSINESS LISTING",
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      planId: 1,
      name: "HIRE PROFILE",
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      planId: 1,
      name: "PRODUCT LISTING",
      isAvailable: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      planId: 1,
      name: "OFFER LISTING",
      isAvailable: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      planId: 1,
      name: "VERIFICATION BADGE",
      isAvailable: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      planId: 2,
      name: "BUSINESS LISTING",
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      planId: 2,
      name: "VERIFICATION BADGE",
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      planId: 2,
      name: "30 PRODUCTS LISTING",
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      planId: 2,
      name: "15 OFFERS LISTING/MONTH(EACH OFFER VALID FOR 3 DAYS)",
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      planId: 3,
      name: "BUSINESS LISTING",
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      planId: 3,
      name: "VERIFICATION BADGE",
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      planId: 3,
      name: "80 PRODUCTS LISTING",
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      planId: 3,
      name: "40 OFFERS LISTING/MONTH(EACH OFFER VALID FOR 5 DAYS)",
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      planId: 4,
      name: "HIRE PROFILE",
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      planId: 4,
      name: "VERIFICATION BADGE",
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  await db.insert(planAttributes).values(planAttributesData);
};

// 3. transactions
// const addtransactions = async () => {
//   const [transaction]: any[] = await sql.execute("SELECT * FROM transactions");

//   for (const row of transaction) {
//     await db.insert(transactions).values({
//       id: row.id,
//       amount: row.amount,
//       transactionsNo: row.txnid,
//       createdAt: row.created_at,
//       updatedAt: row.updated_at,
//     });
//   }
//   console.log("successfully seed of transaction");
// };

// // 4. user_subscriptions
// const addUserSubscriptions = async () => {
//   const [subscriptions]: any[] = await sql.execute(
//     "SELECT * FROM user_subscriptions ",
//   );
//   for (const row of subscriptions) {
//     const [transaction] = await db
//       .select()
//       .from(transactions)
//       .where(eq(transactions.transactionsNo, row.txnid));

//     if (!transaction) {
//       console.log("transaction not found", row.id);
//       continue;
//     }

//     const [plan] = await db
//       .select()
//       .from(plans1)
//       .where(eq(plans1.id, row.plan_id));
//     if (!plan) {
//       console.log("plan not found", row.id);
//       continue;
//     }

//     const [user] = await db
//       .select()
//       .from(users)
//       .where(eq(users.id, row.user_id));
//     if (!user) {
//       console.log("user not found", row.id);
//       continue;
//     }
//     await db.insert(userSubscriptions).values({
//       id: row.id,
//       userId: user.id,
//       subscriptionNumber: row.user_subscriptions,
//       transactionId: transaction.id,
//       price: row.price,
//       plansId: plan.id,
//       expiryDate: row.days,
//       status: Boolean(row.status),
//       createdAt: row.created_at,
//       updatedAt: row.updated_at,
//     });
//   }
// };
