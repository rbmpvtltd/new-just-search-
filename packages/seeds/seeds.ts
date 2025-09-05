import dotenv from "dotenv";
import { businessSeed } from "./business.seed.js";
// import { communicationSeed } from "./communication.seed";
// import { businessSeed } from "./business.seed";
// import { communicationSeed } from "./communication.seed";
import { fakeSeed } from "./fake.seed.js";
import { feedbackseed } from "./feedback.seed.js";
import { hireSeed } from "./hires.seeds.js";
import { notRelated } from "./notrelated.seed.js";
import { offerSeed } from "./offer.seed.js";
import { planSeed } from "./plan.seed.js";
import { productSeed } from "./product.seed.js";
import { seedRequestAccounts } from "./requestacount.seed.js";
import { userSeed } from "./user.seed.js";

dotenv.config();

(async () => {
  try {
    // Postgres seeding
    await notRelated();
    // await userSeed();
    // await fakeSeed();
    // await businessSeed();
    // await hireSeed();
    // await productSeed();
    // await offerSeed();
    // await feedbackseed();
    // await seedRequestAccounts();
    // await planSeed();
    // await communicationSeed();
    // await referSeed();

    console.log("✅ All seeds inserted successfully");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
})();
