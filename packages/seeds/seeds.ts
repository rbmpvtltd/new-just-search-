import dotenv from "dotenv";
import { notRelated } from "./notrelated.seed";

// import { businessSeed } from "./business.seed";
// import { communicationSeed } from "./communication.seed";
// import { businessSeed } from "./business.seed";
// import { communicationSeed } from "./communication.seed";
// import { fakeSeed } from "./fake.seed";
// import { feedbackseed } from "./feedback.seed";
// import { hireSeed } from "./hires.seeds";

// import { offerSeed } from "./offer.seed";
// import { planSeed } from "./plan.seed";
// import { productSeed } from "./product.seed";
// import { seedRequestAccounts } from "./requestacount.seed";
// import { userSeed } from "./user.seed";

export const clouadinaryFake = false;
export const dummyImageUrl = "dummyImageUrl";
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
